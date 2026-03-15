using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MigrationTool
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnProceed_Click(object sender, EventArgs e)
        {
            using (MigrationProcess process = new MigrationProcess(txtSiteUrl.Text, txtSQLConnStr.Text))
            {
                process.Execute();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            using (MigrationProcess process = new MigrationProcess(txtSiteUrl.Text, txtSQLConnStr.Text))
            {
                process.DownloadAttachmentAgain(txtFolder.Text);
            }
        }
    }
}
