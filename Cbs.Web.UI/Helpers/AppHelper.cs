using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Helpers
{
    public static class AppHelper
    {
        public static string ApplicationName { get; set; } = "GIS Web";
        public static string SelectedLanguageKey { get; set; } = "tr-TR";
        public static string WebApiUrl { get; set; }
        public static string AppUrl { get; set; }
        public static string OdataUrl { get; set; }
        public static string Version { get; set; }

        public static string MakePartialViewName(this string viewName, bool suffix = false)
        {
            var _view = viewName;
            if (suffix)
                _view += "_partial";

            string yol = "~/Views/Partial/" + _view + ".cshtml";

            return yol;
        }
    }
}
