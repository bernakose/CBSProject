using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Models
{
    public class LoginViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public List<string> Messages { get; set; } = new List<string>();
        public bool IsLoginError { get; set; }
        public string SelectedLanguageKey { get; set; }
        public LoginViewModel(string languageKey)
        {
            SelectedLanguageKey = languageKey;
        }
        public LoginViewModel()
        {

        }
    }
}
