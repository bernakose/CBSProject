using Cbs.Core.Interfaces.UserInterfaces;
using Cbs.Data.Entities.UserOperations;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.RequestModels.Other;
using Cbs.Data.Models.ResponceModels.Other;
using Ninject;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Business.Managers
{
    public class UserManager : IUserService
    {
        readonly IUserService us;
        public UserManager([Named("UserCore")] IUserService _us)
        {
            us = _us;
        }

        public bool AddGroup(UserGroup group)
        {
            throw new NotImplementedException();
        }

        //public bool AddGroupUser(long id, GroupRequestModel group)
        //{
        //    return us.AddGroupUser(id, group);
        //}

        public bool CheckGroup(long groupId)
        {
            throw new NotImplementedException();
        }

        public bool CheckGroupName(string groupName)
        {
            throw new NotImplementedException();
        }

        public bool CheckGroupName(string groupName, long groupId)
        {
            throw new NotImplementedException();
        }

        //public bool CompleteUserAppChange(long userId)
        //{
        //    return us.CompleteUserAppChange(userId);
        //}

        public bool DeleteGroup(long groupId)
        {
            throw new NotImplementedException();
        }

        public List<UserFunctions> GetFunctions()
        {
            throw new NotImplementedException();
        }

        public GroupResponseModelItem GetGroup(long groupId)
        {
            throw new NotImplementedException();
        }

        public List<UserGroup> GetGroups()
        {
            throw new NotImplementedException();
        }               

        public List<LdapUser> GetLdapUsers()
        {
            return us.GetLdapUsers();
        }

        //public SessionUserModel GetSessionUser()
        //{
        //    return us.GetSessionUser();
        //}

        //public string GetUserAvatar(string userName)
        //{
        //    return us.GetUserAvatar(userName);
        //}

        public List<User> GetUsers()
        {
            throw new NotImplementedException();
        }

        //public bool IsAppChanged(long userId)
        //{
        //    return us.IsAppChanged(userId);
        //}

        public bool IsGroupDeletable(long groupId)
        {
            throw new NotImplementedException();
        }

        //public LoginResponceModel LdapLogin(string username, string password)
        //{
        //    return us.LdapLogin(username, password);
        //}

        public LoginResponceModel Login(string username, string password, int applicationTypeCode)
        {
            return us.Login(username, password, applicationTypeCode);
        }

        //public bool SaveGroupAuth(UserGroup group, List<decimal> authlist)
        //{
        //    return us.SaveGroupAuth(group, authlist);
        //}

        //public bool SaveUserProfile(string AvatarImageName, string Password, string FileName, long Id, List<string> AvartarImageLists)
        //{
        //    return us.SaveUserProfile(AvatarImageName, Password, FileName, Id, AvartarImageLists);
        //}

        //public bool SaveUserWebMapSettings(long userId, int zoom, decimal CenterX, decimal CenterY)
        //{
        //    return us.SaveUserWebMapSettings(userId, zoom, CenterX, CenterY);
        //}

        //public void SetSessionUser(SessionUserModel _sessionUser)
        //{
        //    us.SetSessionUser(_sessionUser);
        //}

        //public void SetUserSelectedLanguage(long userId, string languageShortKey)
        //{
        //    us.SetUserSelectedLanguage(userId, languageShortKey);
        //}

        //public void UpdateUserLogoutLog(SessionUserModel user, DateTime? date)
        //{
        //    us.UpdateUserLogoutLog(user, date);
        //}

        //public AppUserLoginLogout WriteUserInfoLog(SessionUserModel user, string browserInfo, string ip, long appTypeCode)
        //{
        //    return us.WriteUserInfoLog(user, browserInfo, ip, appTypeCode);
        //}
    }
}
