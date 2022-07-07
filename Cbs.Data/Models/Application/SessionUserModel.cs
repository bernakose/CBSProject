using Cbs.Data.Models.ResponceModels.Other;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.Application
{
    public class SessionUserModel
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public string MailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsSystemAdmin { get; set; }
        public SessionUserAuthGroupModel AuthGroup { get; set; }
        public SessionUserTitle Title { get; set; }
        public string SessionId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginDatetime { get; set; }
        public string SelectedLanguageShortName { get; set; }
        public List<SessionUserAuthItemModel> AuthList { get; set; }
        public List<LayerGroupModel> UserLayers { get; set; }
        public int TimeOut { get; set; }
        public long LastLoginLogId { get; set; }
        public int WebZoom { get; set; }
        public decimal WebCenterX { get; set; }
        public decimal WebCenterY { get; set; }
        public string AvatarImage { get; set; }
        public List<WebMenuResponseModelItem> WebMenuItems { get; set; } = new List<WebMenuResponseModelItem>();
        public SessionUserModel()
        {
            AuthGroup = new SessionUserAuthGroupModel();
            Title = new SessionUserTitle();
            AuthList = new List<SessionUserAuthItemModel>();
            UserLayers = new List<LayerGroupModel>();
            WebZoom = 6;
            WebCenterX = 0;
            WebCenterY = 0;
            AvatarImage = "data:image/jpeg;base64,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";
        }
    }
}
