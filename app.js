(function() {

  return {
    resources: {
      DOMAIN_PATTERN: /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
      DATE_FORMAT: 'MMMM Do YYYY'
    },

    events: {
      'app.activated': 'showSearch',
      'click .action': 'handleClick'
    },

    requests: {
      fetchMessagesByEmail: function (email) {
        var dateFormat = 'YYYY-MM-DD';
        var now = moment();
        var then = now.clone().subtract(1, 'month');
        return {
          url: 'https://mandrillapp.com/api/1.0/messages/search.json',
          type:'POST',
          dataType: 'json',
          data: {
            key: this.settings.api_key,
            date_from: then.format(dateFormat),
            date_to: now.format(dateFormat),
            query: "full_email:"+email,
          }
        };
      }
    },

    buildMessageFromMandrillSearch: function (result) {
      result.formatted_send_date = moment.unix(result.ts).format(this.resources.DATE_FORMAT);
      result.is_opened = (result.opens && result.opens > 0);
      if (result.is_opened) {
        var last_open = result.opens_detail[result.opens_detail.length - 1];
        result.formatted_last_opened_date = moment.unix(last_open.ts).format(this.resources.DATE_FORMAT);
      }
      return result;
    },

    formatDateString: function (date_string, format) {
      format = format || this.resources.DATE_FORMAT;
      return moment(date_string).format(format);
    },

    getCustomerEmail: function () {
        if (this.currentLocation() === 'ticket_sidebar') {
            return this.ticket().requester().email();
        } else if (this.currentLocation() === 'user_sidebar') {
            return this.user().email();
        }
        return;
    },

    getDomainFromURL: function(baseURI) {
      var regexResult = this.resources.DOMAIN_PATTERN.exec(baseURI);
      return regexResult[0];
    },

    handleClick: function (e, data) {
      e.preventDefault();
      var link = this.$(e.target);
      switch (true) {
        case link.is('.show-search'):
          this.showSearch(e, link.data());
          break;
        case link.is('.show-settings'):
          this.showAppSettings(e, link.data());
          break;
      }
    },

    showAppSettings: function(e, data) {
      var approvedSettings = this.clone(this.settings);
      if (approvedSettings.api_key) {
        var original = approvedSettings.api_key;
        var masked = original.substring(3, original.length);
        approvedSettings.api_key = original.replace(masked, Array(masked.length).join('x'));
      }
      var pageData = {
        title: this.I18n.t('settingsPage.title'),
        settings: approvedSettings,
        email: this.currentUser().email(),
        uri: this.getDomainFromURL(e.currentTarget.baseURI),
        installation_id: this.installationId()
      };
      this.switchTo('settingsPage', pageData);
    },

    showSearch: function(e, data) {
      if (this.verifyConfiguration(e, data)) {
        var app = this;
        var pageData = {
          title: app.I18n.t('searchPage.title'),
          messages: [],
          expected_queries: [],
          queries_completed: 0
        };
        app.switchTo('loading');

        var displayResults = function () {
          app.switchTo('searchPage', pageData);
        };

        var aggregateResults = function (data) {
          pageData.queries_completed++;
          for (var i = data.length - 1; i >= 0; i--) {
            pageData.messages.unshift(
              app.buildMessageFromMandrillSearch(data[i])
            );
          }
          if (pageData.queries_completed >= pageData.expected_queries.length) {
            displayResults();
          }
        };

        var email = app.getCustomerEmail();
        if (email) {
          pageData.expected_queries.push(email);
          app.ajax('fetchMessagesByEmail', email).done(aggregateResults);
        }

        if (pageData.expected_queries === 0) {
          displayResults();
        }
      }
    },

    verifyConfiguration: function (e, data) {
      if (this.settings.api_key && this.settings.api_key) {
        return true;
      }
      this.showAppSettings(e, data);
      return false;
    }
  };

}());
