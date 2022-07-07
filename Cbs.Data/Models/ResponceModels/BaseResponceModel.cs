using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels
{
    public class BaseResponceModel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string MessageCode { get; set; }
        public BaseResponceModel()
        {
            IsSuccess = false;
        }
    }
}
