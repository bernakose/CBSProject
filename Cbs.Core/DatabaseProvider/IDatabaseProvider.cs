using Cbs.Data.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Core.DatabaseProvider
{
    public interface IDatabaseProvider
    {
        IDatabaseContext Context { get; set; }
    }
}
