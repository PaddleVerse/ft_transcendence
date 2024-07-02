/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['i.ibb.co',
        'lh3.googleusercontent.com',
        'cdn.intra.42.fr',
        'i.postimg.cc',
        'e3r3p18.1337.ma',
        'images.unsplash.com',
        'cdn.builder.io',
        'preview.redd.it',
        'img.pikbest.com',
        'randomuser.me',
        'res.cloudinary.com',
        `${process.env.NEXT_PUBLIC_FRONT_URL}`
        ],
      },
      compiler: {
        styledComponents: true,
      },
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
        
        // disable minizing for all
        config.optimization.minimize = false;

        return config;
      },
}

module.exports = nextConfig
