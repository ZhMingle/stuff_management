using System;
using stuff_management_server.Models;
using Microsoft.EntityFrameworkCore;

namespace stuff_management_server.Data
{
    public class StuffManagementContext: DbContext
    {
        public StuffManagementContext(DbContextOptions<StuffManagementContext> options) : base(options)
        {

        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 配置Category的自引用关系
            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict); // 防止删除父类别时级联删除子类别

            // 配置Item和Category的关系
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CategoryId)
                .OnDelete(DeleteBehavior.SetNull); // 删除类别时，物品的类别设为null

            // 种子数据 - 默认类别
            modelBuilder.Entity<Category>().HasData(
                new Category 
                { 
                    CategoryId = 1, 
                    Name = "电子产品", 
                    Description = "各种电子设备和配件",
                    Color = "#007bff",
                    SortOrder = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category 
                { 
                    CategoryId = 2, 
                    Name = "服装鞋帽", 
                    Description = "衣物、鞋子、帽子等",
                    Color = "#28a745",
                    SortOrder = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category 
                { 
                    CategoryId = 3, 
                    Name = "书籍文具", 
                    Description = "书籍、笔记本、文具用品",
                    Color = "#ffc107",
                    SortOrder = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category 
                { 
                    CategoryId = 4, 
                    Name = "家居用品", 
                    Description = "家具、装饰品、生活用品",
                    Color = "#dc3545",
                    SortOrder = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category 
                { 
                    CategoryId = 5, 
                    Name = "其他", 
                    Description = "其他未分类物品",
                    Color = "#6c757d",
                    SortOrder = 999,
                    IsActive = true,
                    IsDefault = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
