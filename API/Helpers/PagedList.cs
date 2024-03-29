﻿using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        private PagedList(IEnumerable<T> items, int pageNumber, int pageSize, int totalCount)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            PageSize = pageSize;
            TotalCount = totalCount;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source , int pageNum,int pageSize)
        {
            var totalCount = await source.CountAsync();
            var items = await source.Skip((pageNum - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items,pageNum,pageSize, totalCount);
        }


    }
}
