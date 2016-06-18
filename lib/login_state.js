if(!LoginState) {
  LoginState = {};
}

LoginState.init = function(domain, cookieName, maxage, customDataFn) {
  if(typeof domain == "undefined") {
    throw new Error("domain is required for login-state");
  }

  cookieName = cookieName || "meteor-login-state";
  maxage = maxage || 365;

  Tracker.autorun(function() {
    var user = Meteor.user && Meteor.user();
    var loginTokenLength = user.services.resume.loginTokens.length - 1;
    if(user) {
      var data = {
        timestamp: Date.now(),
        username: user.username,
        userId: user._id,
        authtoken: user.services.resume.loginTokens[loginTokenLength]
        email: user.emails && user.emails[0] && user.emails[0].address,
        url: window.location.origin
      };

      if(customDataFn) {
        data.custom = Tracker.nonreactive(function () {
          return customDataFn();
        });
      }

      Cookie.set(cookieName, JSON.stringify(data), {
        path: "/",
        expires: maxage,
        domain: domain
      });
    } else {
      Cookie.set(cookieName, "", {
        path: "/",
        expires: -1,
        domain: domain
      });
    }
  });
};
