using System.Web;

namespace API {

    public class MvcApplication : HttpApplication {
        protected void Application_Start() {
            // Web API, CORS and OAuth are registered once in the OWIN pipeline (OAuth/Startup.cs).
        }
    }
}