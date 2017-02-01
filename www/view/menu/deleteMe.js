initialize: function() {
        // config element to slide here
        this.$container = $('.map');

        this.options = {};
        this.width = (this.$container.width() / 100 * 83);
        this.visible = true;
        this.blur = true;

        // config speed of slide
        this.speed = 200;
    },

    render: function() {
        this.$el.html(template());

        return this;
    },

    hide: function() {
        this.$('.menu-button').hide();
    },

    show: function() {
        this.$('.menu-button').show();
    },

    openLink: function() {
        console.log('boom');
    },

    toggleMenu: function() {
        _log('show menu');

        var self = this;

        self.options['left'] = this.width;

        this.$('.menu-button').animate(self.options, self.speed, 'swing');
        this.$container.animate(self.options, self.speed, 'swing');

        this.toggleZIndexes();
        this.toggleBlur();

        // toggle values
        this.width = this.width > 0 ? '0' : (this.$container.width() / 100 * 83);
    },