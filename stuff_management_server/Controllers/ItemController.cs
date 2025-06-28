using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stuff_management_server.Data;
using stuff_management_server.Models;

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
        public async Task<ActionResult<Item>> CreateItem(Item item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;
            
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
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
    }
} 