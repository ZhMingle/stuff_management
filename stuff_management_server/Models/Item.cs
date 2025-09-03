using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace stuff_management_server.Models
{
    public enum ItemStatus
    {
        Active,         // 正常使用
        Inactive,       // 闲置
        Broken,         // 损坏
        Lost,           // 丢失
        Sold,           // 已售出
        Donated,        // 已捐赠
        Expired         // 过期
    }

    public class Item
    {
        [Key]
        public int ItemId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string SubCategory { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Brand { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Model { get; set; } = string.Empty;
        
        public ItemStatus Status { get; set; } = ItemStatus.Active;
        
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Notes { get; set; } = string.Empty;
        
        [MaxLength(2000)]
        public string ImageUrl { get; set; } = string.Empty; // 逗号分隔的多张图片URL
        
        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }
        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
        
        public DateTime? PurchaseDate { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        [Range(0, 10)]
        public int? Condition { get; set; } // 1-10 评分，10为最佳状态
        
        [MaxLength(100)]
        public string Tags { get; set; } = string.Empty; // 逗号分隔的标签
        
        // 外键关联
        public int? CategoryId { get; set; }
        
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
        
        // 审计字段
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

