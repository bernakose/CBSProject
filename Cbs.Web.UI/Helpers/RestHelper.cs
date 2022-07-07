using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Helpers
{
    public class RestHelper
    {
        public static RestClient GetClient(string url)
        {
            var client = new RestClient(AppHelper.WebApiUrl + url);

            return client;
        }
        public static RestRequest GetRequest(Method method, string jsonBody = null)
        {
            var request = new RestRequest(method);

            var user = UserHelper.GetUser();
            if (user != null && user.Id > 0)
            {
                request.AddHeader("authorization", "Basic " + user.SessionId);
            }

            request.AddHeader("content-type", "application/json");
            if (!string.IsNullOrEmpty(jsonBody))
                request.AddParameter("application/json", jsonBody, ParameterType.RequestBody);

            return request;
        }
    }
}