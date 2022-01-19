const ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/DeLorean-47/delorean-47.github.io', // Update to point to your repository  
        user: {
            name: 'Albert Han', // update to use your name
            email: 'albert.h1231@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
