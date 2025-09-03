using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stuff_management_server.Data;
using stuff_management_server.Models;
using System.IO;

namespace stuff_management_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly StuffManagementContext _context;

        public ItemController(StuffManagementContext context)
        {
            _context = context;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems(
            [FromQuery] int? categoryId = null,
            [FromQuery] ItemStatus? status = null,
            [FromQuery] string? searchTerm = null)
        {
            var query = _context.Items
                .Include(i => i.Category)
                .AsQueryable();

            // 按类别筛选
            if (categoryId.HasValue)
            {
                query = query.Where(i => i.CategoryId == categoryId);
            }

            // 按状态筛选
            if (status.HasValue)
            {
                query = query.Where(i => i.Status == status);
            }

            // 按搜索词筛选
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(i => 
                    i.Name.Contains(searchTerm) || 
                    i.Brand.Contains(searchTerm) || 
                    i.Model.Contains(searchTerm) ||
                    i.Notes.Contains(searchTerm) ||
                    i.Tags.Contains(searchTerm));
            }

            return await query
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.ItemId == id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // POST: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> CreateItem([FromBody] Item item)
        {
            try
            {
                // 调试：记录接收到的数据
                Console.WriteLine($"接收到创建物品请求: {System.Text.Json.JsonSerializer.Serialize(item)}");
                
                // 验证必填字段
                if (string.IsNullOrWhiteSpace(item.Name))
                {
                    Console.WriteLine("错误: 物品名称为空");
                    return BadRequest(new { error = "物品名称不能为空" });
                }

                // 设置默认值
                item.CreatedAt = DateTime.UtcNow;
                item.UpdatedAt = DateTime.UtcNow;
                
                // 确保必填字段有默认值
                if (string.IsNullOrEmpty(item.SubCategory)) item.SubCategory = "";
                if (string.IsNullOrEmpty(item.Brand)) item.Brand = "";
                if (string.IsNullOrEmpty(item.Model)) item.Model = "";
                if (string.IsNullOrEmpty(item.Location)) item.Location = "";
                if (string.IsNullOrEmpty(item.Notes)) item.Notes = "";
                if (string.IsNullOrEmpty(item.ImageUrl)) item.ImageUrl = "";
                if (string.IsNullOrEmpty(item.Tags)) item.Tags = "";
                if (item.Quantity <= 0) item.Quantity = 1;
                
                Console.WriteLine($"处理后的物品数据: {System.Text.Json.JsonSerializer.Serialize(item)}");
                
                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                Console.WriteLine($"物品创建成功，ID: {item.ItemId}");
                return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"创建物品时发生异常: {ex.Message}");
                Console.WriteLine($"异常堆栈: {ex.StackTrace}");
                return BadRequest(new { error = ex.Message, details = ex.ToString() });
            }
        }

        // PUT: api/Item/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            var existingItem = await _context.Items.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound();
            }

            // 更新所有属性
            existingItem.Name = item.Name;
            existingItem.SubCategory = item.SubCategory;
            existingItem.Brand = item.Brand;
            existingItem.Model = item.Model;
            existingItem.Status = item.Status;
            existingItem.Location = item.Location;
            existingItem.Notes = item.Notes;
            existingItem.ImageUrl = item.ImageUrl;
            existingItem.Price = item.Price;
            existingItem.Quantity = item.Quantity;
            existingItem.PurchaseDate = item.PurchaseDate;
            existingItem.ExpiryDate = item.ExpiryDate;
            existingItem.Condition = item.Condition;
            existingItem.Tags = item.Tags;
            existingItem.CategoryId = item.CategoryId;
            existingItem.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Item/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetItemStatistics()
        {
            var totalItems = await _context.Items.CountAsync();
            var totalValue = await _context.Items
                .Where(i => i.Price.HasValue)
                .SumAsync(i => i.Price.Value * i.Quantity);

            var statusCounts = await _context.Items
                .GroupBy(i => i.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var categoryCounts = await _context.Items
                .GroupBy(i => i.Category.Name)
                .Select(g => new { Category = g.Key ?? "未分类", Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            return new
            {
                TotalItems = totalItems,
                TotalValue = totalValue,
                StatusCounts = statusCounts,
                CategoryCounts = categoryCounts
            };
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }

        // POST: api/Item/upload-image
        [HttpPost("upload-image")]
        public async Task<ActionResult<object>> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { error = "没有选择文件" });
                }

                // 验证文件类型
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { error = "不支持的文件类型。只支持 JPG, PNG, GIF, WEBP 格式" });
                }

                // 验证文件大小 (最大 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { error = "文件大小不能超过 5MB" });
                }

                // 创建上传目录
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // 生成唯一文件名
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // 保存文件
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 返回文件URL
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var fileUrl = $"{baseUrl}/uploads/{fileName}";
                
                Console.WriteLine($"图片上传成功: {fileUrl}");
                
                return Ok(new { 
                    success = true, 
                    imageUrl = fileUrl,
                    fileName = fileName
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"图片上传失败: {ex.Message}");
                return StatusCode(500, new { error = "图片上传失败", details = ex.Message });
            }
        }

        // POST: api/Item/upload-multiple-images
        [HttpPost("upload-multiple-images")]
        public async Task<ActionResult<object>> UploadMultipleImages(IFormFileCollection files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest(new { error = "没有选择文件" });
                }

                // 验证文件数量 (最多10张)
                if (files.Count > 10)
                {
                    return BadRequest(new { error = "最多只能上传10张图片" });
                }

                var uploadedUrls = new List<string>();
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

                // 创建上传目录
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                foreach (var file in files)
                {
                    if (file.Length == 0) continue;

                    // 验证文件类型
                    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest(new { error = $"文件 {file.FileName} 格式不支持。只支持 JPG, PNG, GIF, WEBP 格式" });
                    }

                    // 验证文件大小 (最大 5MB)
                    if (file.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest(new { error = $"文件 {file.FileName} 大小不能超过 5MB" });
                    }

                    // 生成唯一文件名
                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // 保存文件
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // 添加到结果列表
                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    var fileUrl = $"{baseUrl}/uploads/{fileName}";
                    uploadedUrls.Add(fileUrl);
                }

                Console.WriteLine($"批量图片上传成功: {string.Join(", ", uploadedUrls)}");
                
                return Ok(new { 
                    success = true, 
                    imageUrls = uploadedUrls,
                    count = uploadedUrls.Count
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"批量图片上传失败: {ex.Message}");
                return StatusCode(500, new { error = "批量图片上传失败", details = ex.Message });
            }
        }
    }
} 