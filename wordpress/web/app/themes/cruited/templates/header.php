<header class="banner" role="banner">
    <div id="small-medium-screen-menu" class="container">
        <div>
            <div>
                <a class="brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
                <button class="styleless"></button>
            </div>
        </div>

        <nav role="navigation">
            <div>
                <?php
                if (has_nav_menu('primary_navigation')) :
                    wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
                endif;
                ?>

                <div class="other-nav-ux">
                    <a href="/users/">Logga in</a>

                    <a href="/users/select-document/" class="btn secondary">Börja nu</a>

                    <!-- select class="form-control">
                        <option value="sv">Sv</option>
                        <option value="en">En</option>
                    </select -->
                </div>
            </div>
        </nav>
    </div>

    <div id="large-screen-menu" class="container">
        <div>
            <a class="brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>

            <nav role="navigation">
                <?php
                if (has_nav_menu('primary_navigation')) :
                    wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
                endif;
                ?>

                <div class="other-nav-ux">
                    <a href="/users/">Logga in</a>

                    <a href="/users/select-document/" class="btn secondary">Börja nu</a>

                    <!-- select class="form-control">
                        <option value="sv">Sv</option>
                        <option value="en">En</option>
                    </select -->
                </div>
            </nav>
        </div>
    </div>
</header>
