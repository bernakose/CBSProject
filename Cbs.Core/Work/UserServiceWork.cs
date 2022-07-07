using Cbs.Core.DatabaseProvider;
using Cbs.Core.Interfaces.UserInterfaces;
using Cbs.Data.Entities.UserOperations;
using Cbs.Data.Enums;
using Cbs.Data.Framework;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.RequestModels.Other;
using Cbs.Data.Models.ResponceModels;
using Cbs.Data.Models.ResponceModels.Other;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.IO;
using System.Linq;

namespace Cbs.Core.Work
{
    public class UserServiceWork : IUserService
    {
        private IDatabaseContext db;

        private static SessionUserModel _sessionUserModel { get; set; }


        public UserServiceWork(IDatabaseProvider databaseProvider)
        {
            db = databaseProvider.Context;

        }

        public LoginResponceModel Login(string username, string password, int applicationTypeCode)
        {
            LoginResponceModel result = new LoginResponceModel();
            try
            {
                var pas = password;

                bool isApplyLdapAuth = false;

              
                try
                {
                    User kul = null;

                    if (isApplyLdapAuth)
                    {
                        kul = db.Users.FirstOrDefault(a => a.UserName.ToLower() == username.ToLower());
                    }
                    else
                    {
                        kul = db.Users.FirstOrDefault(a => a.UserName.ToLower() == username.ToLower() && a.Password == pas);
                    }

                    if (kul != null)
                    {
                        result.IsException = false;
                        //kul.date = DateTime.Now;
                        db.SaveChanges();
                        result.SessionUser = new SessionUserModel()
                        {
                            Id = kul.UserId,
                            //AvatarImage = kul.AvatarImage,
                            //AvatarImageName = kul.AvatarImageName,
                            //IsSystemAdmin = kul.IsSystemAdmin == 1,
                            MailAddress = kul.MailAddress,
                            Name = kul.Name,
                            Password = kul.Password,
                            //PhoneNumber = kul.Phone,
                            Surname = kul.SurName,
                            Username = kul.UserName,
                            //AuthCounty = db.UserCounties.Where(x => x.UserId == kul.Id).Select(x => x.CountyCode).ToList(),
                            SessionId = Guid.NewGuid().ToString(),
                            //IsActive = kul.Status == 1,
                            //LastLoginDatetime = kul.LastLoginDatetime,
                            //SelectedLanguageShortName = kul.SelectedLanguageShortName,
                            //WebCenterX = kul.WebCenterX,
                            //WebCenterY = kul.WebCenterY,
                            //WebZoom = kul.WebZoom
                        };
                        var group = db.UserGroups.FirstOrDefault(a => a.GroupId == kul.GroupId);
                        if (group != null)
                        {
                            result.SessionUser.AuthGroup = new SessionUserAuthGroupModel()
                            {
                                AuthGroupName = group.GroupName,
                                Id = group.GroupId
                            };
                        }
                 

                        SessionUser._sessionUser = kul;
                        SessionUser.ApplicationName = ((AppTypeEnum)applicationTypeCode).ToString();
                    }
                    else
                    {
                        result.IsException = true;
                        result.ExceptionMessage = "No user found !!!";
                        result.ExceptionMessageCode ="";
                    }
                }
                catch (Exception ex)
                {
                    result.IsException = true;
                    result.ExceptionMessageCode = ""; // 1941
                }

            }
            catch (TimeoutException ex)
            {
                result.IsException = true;
                result.ExceptionMessageCode = ""; // 1941
            }
            return result;
        }
      
        public static void FileLog(string logMessage, string LogLocation)
        {
            if (!System.IO.File.Exists(LogLocation))
            {
                var dir = Path.GetDirectoryName(LogLocation);
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);
                using (Stream w = System.IO.File.Create(LogLocation))
                {
                    w.Close();
                }

                using (StreamWriter w = System.IO.File.AppendText(LogLocation))
                {
                    logMessage += " ExecutionTime: " + DateTime.Now.ToString();
                    w.Write("\r\nLog Entry : ");
                    w.WriteLine("  {0}", logMessage);
                    w.Close();
                }
            }
            else
            {
                using (StreamWriter w = System.IO.File.AppendText(LogLocation))
                {
                    logMessage += " ExecutionTime: " + DateTime.Now.ToString();
                    w.Write("\r\nLog Entry : ");
                    w.WriteLine("  {0}", logMessage);
                    w.Close();
                }

                long length = new System.IO.FileInfo(LogLocation).Length;

                //Delete first 200,000 records so the file size reduces
                if (length > 20971520) //Represents ~ 20MB 
                {
                    System.IO.File.WriteAllLines(LogLocation, System.IO.File.ReadAllLines(LogLocation).Skip(200000).ToArray());
                }
            }
        }

        public List<LdapUser> GetLdapUsers()
        {
            List<LdapUser> lst = new List<LdapUser>();
            bool isApplyLdapAuth = false;


            try
            {

                var ldapSetting = db.Settings.FirstOrDefault(a => a.Name == "IsLdapAuth");

                if (ldapSetting != null)
                {
                    isApplyLdapAuth = ldapSetting.Value == "1";
                }

                if (isApplyLdapAuth)
                {

                    var urls = db.Settings.FirstOrDefault(a => a.Name == "LdapDomains").Value.Split(';');

                    var propobjectGUID = db.Settings.FirstOrDefault(a => a.Name == "Ldap-objectGUID").Value;
                    var propsamAccountName = db.Settings.FirstOrDefault(a => a.Name == "Ldap-samAccountName").Value;
                    var propgivenName = db.Settings.FirstOrDefault(a => a.Name == "Ldap-givenName").Value;
                    var propsn = db.Settings.FirstOrDefault(a => a.Name == "Ldap-sn").Value;
                    var propdisplayName = db.Settings.FirstOrDefault(a => a.Name == "Ldap-displayName").Value;
                    var propuserPrincipalName = db.Settings.FirstOrDefault(a => a.Name == "Ldap-userPrincipalName").Value;
                    var propdistinguishedName = db.Settings.FirstOrDefault(a => a.Name == "Ldap-distinguishedName").Value;


                    foreach (var item in urls)
                    {
                        if (item.Trim().Length > 0)
                        {
                            //LDAP://basarsoft.com.tr/DC=basarsoft,DC=com,DC=tr
                            string path = "";

                            var dcs = item.Trim().Split('.');
                            path = "LDAP://" + item.Trim() + "/";

                            for (int i = 0; i < dcs.Length; i++)
                            {
                                dcs[i] = "DC=" + dcs[i];
                            }
                            path += string.Join(",", dcs);


                            DirectoryEntry searchRoot = new DirectoryEntry(path);
                            DirectorySearcher ds = null;

                            //var result = new DirectorySearcher(searchRoot)
                            //{
                            //    //Filter = "(&(objectCategory=Person)(objectClass=user))"
                            //}.FindAll();
                            ds = new DirectorySearcher(searchRoot);
                            ds.Filter = "(&(objectCategory=Person)(objectClass=user))";
                            var result = ds.FindAll();



                            foreach (SearchResult itemDe in result)
                            {

                                try
                                {
                                    var guid = itemDe.Properties[propobjectGUID].Count > 0 ? itemDe.Properties[propobjectGUID][0].ToString() : "";
                                    var samAccountName = itemDe.Properties[propsamAccountName].Count > 0 ? itemDe.Properties[propsamAccountName][0].ToString() : "";
                                    var firstName = itemDe.Properties[propgivenName].Count > 0 ? itemDe.Properties[propgivenName][0].ToString() : "";
                                    var lastName = itemDe.Properties[propsn].Count > 0 ? itemDe.Properties[propsn][0].ToString() : "";
                                    var displayName = itemDe.Properties[propdisplayName].Count > 0 ? itemDe.Properties[propdisplayName][0].ToString() : "";
                                    var mail = itemDe.Properties[propuserPrincipalName].Count > 0 ? itemDe.Properties[propuserPrincipalName][0].ToString() : "";
                                    var distinguishedName = itemDe.Properties[propdistinguishedName].Count > 0 ? itemDe.Properties[propdistinguishedName][0].ToString() : "";

                                    List<string> lstGroupNames = new List<string>();

                                    if (!string.IsNullOrEmpty(distinguishedName))
                                    {
                                        var _arr = distinguishedName.Split(',');
                                        foreach (var itemGroup in _arr)
                                        {
                                            if (itemGroup.IndexOf("OU=") >= 0)
                                            {
                                                lstGroupNames.Add(itemGroup.Replace("OU=", "").ToString().Trim());
                                            }
                                        }
                                    }

                                    string userGroups = string.Join(", ", lstGroupNames);

                                    lst.Add(new LdapUser()
                                    {
                                        Username = samAccountName,
                                        Name = firstName,
                                        Surname = lastName,
                                        DisplayName = displayName,
                                        MailAddress = mail,
                                        Group = userGroups
                                    });
                                }
                                catch (Exception ex)
                                {
                                    FileLog("USER ERROR : " + ex.ToString(), @"C:\inetpub\wwwroot\Logs\ErrorLog.txt");

                                }

                            }
                        }
                    }
                    var ldapusers = db.LdapUsers.ToList();
                    db.LdapUsers.RemoveRange(ldapusers);
                    db.SaveChanges();

                    db.LdapUsers.AddRange(lst);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                FileLog("GENERAL ERROR : " + ex.ToString(), @"C:\inetpub\wwwroot\Logs\ErrorLog.txt");

            }

            return lst;
        }

        public List<User> GetUsers()
        {
            return db.Users.OrderBy(a => a.SurName).OrderBy(a => a.Name).ToList();
        }
    }
}
