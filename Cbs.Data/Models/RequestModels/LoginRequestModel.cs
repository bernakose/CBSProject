using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Cbs.Data.Models.RequestModels
{
    public class LoginRequestModel
    {
        /// <summary>
        /// Username
        /// </summary>
        [Required]
        public string Username { get; set; }
        /// <summary>
        /// Password
        /// </summary>
        [Required]
        public string Password { get; set; }
        /// <summary>
        /// ClientInfo: Ip Address, Operating System, Ram, CPU ...
        /// </summary>
        public string ClientInfo { get; set; }
        /// <summary>
        /// Timeout Params
        /// </summary>
        public decimal UserTimeOut { get; set; }
        /// <summary>
        /// Application Type Code
        /// </summary>
        public decimal ApplicationTypeCode { get; set; }

        public LoginRequestModel()
        {
            UserTimeOut = 20;
        }
    }
    /// <summary>
    /// Login Types
    /// </summary>
    public enum LoginAppType
    {
        /// <summary>
        /// None
        /// </summary>
        None = 0,
        /// <summary>
        /// Desktop
        /// </summary>
        Desktop = 1,
        /// <summary>
        /// Web
        /// </summary>
        Web = 2,
        /// <summary>
        /// Web Api Service
        /// </summary>
        WebApi = 3,
        /// <summary>
        /// Admin Interface
        /// </summary>
        Admin = 4
    }
}
