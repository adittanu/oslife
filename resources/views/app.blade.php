<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode: Life, Muslim, Creator, Work.">
        <meta name="author" content="Life OS">

        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Life OS">
        <meta property="og:locale" content="id_ID">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">

        <!-- Theme -->
        <meta name="theme-color" content="#EC4899">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Gochi+Hand&family=Nunito:wght@400;600;800&family=Patrick+Hand&family=Homemade+Apple&family=Reenie+Beanie&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Life OS",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web",
            "description": "All-in-one life management system dengan estetika digital bullet journal",
            "offers": [
                {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "IDR",
                    "name": "Free"
                },
                {
                    "@type": "Offer",
                    "price": "49000",
                    "priceCurrency": "IDR",
                    "name": "Pro"
                }
            ]
        }
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
