﻿using Cbs.Core.DatabaseProvider;
using Cbs.Data.Models.Application;
using Cbs.Web.Api.Dependency;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VYS.CacheManager.Core;

namespace Cbs.Web.Api.Helpers
{
    public class UserHelper
    {
        IDatabaseProvider db { get; set; }
        public UserHelper(IDatabaseProvider _db)
        {
            db = _db;
        }
        public static SessionUserModel User
        {
            get
            {
                try
                {
                    string sessionId = Thread.CurrentPrincipal.Identity.Name;
                    var cacheManager = DependencyModule.Resolve<ICacheManager>();
                    var user = cacheManager.Get<List<SessionUserModel>>(sessionId);
                    if (user == null || user.Count <= 0)
                    {
                        return new SessionUserModel();
                    }
                    else
                    {
                        return user.FirstOrDefault();
                    }
                }
                catch (Exception ex)
                {
                    return new SessionUserModel();
                }
            }
        }
        public static string DefaultUserAvatar
        {
            get
            {
                return "data:image/png;base64,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";
            }
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
