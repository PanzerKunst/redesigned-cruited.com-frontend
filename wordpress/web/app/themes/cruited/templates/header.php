<header class="banner" role="banner">
    <div class="container">
        <div>
            <a class="brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
            <button class="styleless"></button>
        </div>

        <nav role="navigation">
            <?php
            if (has_nav_menu('primary_navigation')) :
                wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
            endif;
            ?>

            <div id="other-nav-ux">
                <a href="/login">Login</a>

                <a href="/products" class="btn secondary">Get Started</a>

                <select class="form-control">
                    <option value="sv">Sv</option>
                    <option value="en">En</option>
                </select>
            </div>
        </nav>
    </div>
</header>
