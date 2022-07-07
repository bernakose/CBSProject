
using Cbs.Core.DatabaseProvider;
using Cbs.Data.Models.Application;
using Cbs.Web.Api.Dependency;
using Cbs.Web.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Threading;
using VYS.CacheManager.Core;

namespace Cbs.Web.Api.Filters
{
    public class BasicAuthFilter : Attribute, IAuthorizationFilter
    {

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                bool fromDesktop = false;
                string authHeader = context.HttpContext.Request.Headers["Authorization"];

                if (authHeader == null)
                {
                    authHeader = context.HttpContext.Request.Headers["AuthorizationCustom"];
                }

                if (authHeader == null)
                {
                    authHeader = context.HttpContext.Request.Headers["AuthorizationFromDesktop"];
                    if (authHeader != null)
                    {
                        fromDesktop = true;
                    }
                }

                if (authHeader != null)
                {
                    if (!fromDesktop)
                    {
                        var authHeaderValue = AuthenticationHeaderValue.Parse(authHeader);

                        var sessionId = authHeaderValue.Parameter;

                        var cacheManager = DependencyModule.Resolve<ICacheManager>();

                        var user = cacheManager.Get<List<SessionUserModel>>(sessionId);

                        if (user != null && user.Count > 0)
                        {
                            Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(sessionId), null);
                            return;
                        }
                        else
                        {
                            context.Result = new UnauthorizedResult();
                        }
                    }
                    else
                    {
                        IDatabaseProvider db = DependencyModule.Resolve<IDatabaseProvider>();

                        var tokenSplit = UserHelper.Base64Decode(authHeader).Split(new[] { ':' }, 2);

                        bool u = db.Context.Users.Any(a => a.UserName == tokenSplit[0] && a.Password == tokenSplit[1]);

                        if (u)
                        {
                            Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(tokenSplit[0]), null);
                            return;
                        }
                        else
                            context.Result = new UnauthorizedResult();
                    }
                }
                else
                {
                    context.Result = new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
