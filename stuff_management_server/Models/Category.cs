using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace stuff_management_server.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? ZhName { get; set; }

    [MaxLength(50)]
    public string? EnName { get; set; }
        
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Icon { get; set; } = string.Empty; // 图标名称或路径
        
        [MaxLength(7)]
        public string Color { get; set; } = "#007bff"; // 十六进制颜色代码
        
        public int? ParentCategoryId { get; set; }
        
        [ForeignKey("ParentCategoryId")]
        public Category? ParentCategory { get; set; }
        
        public int SortOrder { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public bool IsDefault { get; set; } = false; // 是否为默认类别
        
        // 审计字段
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // 导航属性 - 子类别
        public ICollection<Category> SubCategories { get; set; } = new List<Category>();
        
        // 导航属性 - 该类别下的物品
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
} 