import Gtk from 'gi://Gtk?version=4.0';
import Gio from 'gi://Gio';
import { render } from '@react-gjs/core';
Gtk.init();
/**
 * Main application
 */
const application = new Gtk.Application({
    application_id: 'com.example.react-gjs.TODO',
    flags: Gio.ApplicationFlags.FLAGS_NONE,
});
application.connect('activate', (app) => {
    let activeWindow = app.activeWindow;
    if (!activeWindow) {
        activeWindow = new Gtk.ApplicationWindow({
            application: app,
        });
    }
    activeWindow.present();
});
application.run(null);
print(render);
//# sourceMappingURL=index.js.map