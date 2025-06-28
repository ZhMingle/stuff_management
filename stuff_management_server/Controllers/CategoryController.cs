using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stuff_management_server.Data;
using stuff_management_server.Models;

namespace stuff_management_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly StuffManagementContext _context;

        public CategoryController(StuffManagementContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .Where(c => c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.CategoryId == id && c.IsActive);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // GET: api/Category/tree
        [HttpGet("tree")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoryTree()
        {
            return await _context.Categories
                .Include(c => c.SubCategories.Where(sc => sc.IsActive))
                .Where(c => c.ParentCategoryId == null && c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }

        // POST: api/Category
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }

            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.Icon = category.Icon;
            existingCategory.Color = category.Color;
            existingCategory.ParentCategoryId = category.ParentCategoryId;
            existingCategory.SortOrder = category.SortOrder;
            existingCategory.IsActive = category.IsActive;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.CategoryId == id);

            if (category == null)
            {
                return NotFound();
            }

            // 检查是否有子类别
            if (category.SubCategories.Any())
            {
                return BadRequest("无法删除包含子类别的类别");
            }

            // 检查是否有关联的物品
            if (category.Items.Any())
            {
                return BadRequest("无法删除包含物品的类别");
            }

            category.IsActive = false;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }
    }
} 