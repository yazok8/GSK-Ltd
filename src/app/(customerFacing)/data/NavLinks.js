export const NavLinks = [
  {
    id: 'about',
    header: 'About',
    href: '/about',
  },
    {
      id: 'services',
      header: 'Services',
      submenu: 'services',
      ServicesLinks:[
        {
            id:1,
            title:"Import",
        },
        {
            id:2,
            title:"Export"
        },
        {
            id:3,
            title:"Distribution"
        }
      ]
    },
    {
      id: 'products',
      header: 'Products',
      submenu: 'products',
      ProductsLinks:[
        {
            id:1,
            title:"nuts & dried fruits"
        },
        {
            id:2,
            title:"pulses"
        },
        {
            id:3,
            title:"whole & ground spices"
        },
        {
            id:4,
            title:"cardemom"
        },
        {
            id:5,
            title:"herbs"
        },
        {
            id:6,
            title:"baking ingredients"
        },
        {
            id:7,
            title:"sesame"
        },
        {
            id:8,
            title:"birds feed"
        },
        {
            id:9,
            title:"pets food"
        }
        
      ]          
    },

    {
      id: 'contact',
      header: 'Contact Us',
      href: '/contact',
    },
  ];