# Zendesk App for Mandrill

[![Latest Version](https://img.shields.io/github/release/delivered/mandrill-zendesk.svg?style=flat-square)](https://github.com/delivered/mandrill-zendesk/releases)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Access your Mandrill message data from within Zendesk.

## Installation

1. [Download the latest app package](https://github.com/delivered/mandrill-zendesk/releases/latest) - File will be available in the "Downloads" section and look something like `app-YYYYMMDDHHMMSS.zip`.
2. Browse to your Zendesk Apps Management Screen (https://{your-subdomain}.zendesk.com/agent/admin/apps/manage)
3. Click "Upload private app"
4. Enter the name of the app - "Mandrill" is recommended
5. Choose the zip file downloaded in step 1
6. Click "Upload"
7. Approve the terms and conditions by clicking a second "Upload"
8. Enter your Mandrill API key
9. Click "Install"

## Usage

After the app has been successfully installed and enabled, it will show up in the right pane of the User and Ticket views within Zendesk.

Upon initial load of the User Profile or Ticket, the app will search for emails sent through your Mandrill account associated to the User's primary email address or Ticket Requestors email address.

When no message records are found in Mandrill, then the UI will display an alert.

When message records are found in Mandrill, then the UI will display basic message information.

## Contributing

Please see [CONTRIBUTING](https://github.com/delivered/mandrill-zendesk/blob/master/CONTRIBUTING.md) for details.

## Credits

- [Steven Maguire](https://github.com/stevenmaguire)
- [All Contributors](https://github.com/delivered/mandrill-zendesk/contributors)

## License

The MIT License (MIT). Please see [License File](https://github.com/delivered/mandrill-zendesk/blob/master/LICENSE) for more information.



