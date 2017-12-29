// import VueFuse from './fuse.min.js';

// Vue.use(VueFuse)
Vue.use(SocialSharing)

var app = new Vue({
    el: '#app',
    created(){
        this.getData()
        if(JSON.parse(localStorage.getItem('ShoppingCart'))){
            this.shoppingCart = JSON.parse(localStorage.getItem('ShoppingCart'))
        }else {
            this.shoppingCart = [] 
        }
       
    },
    // mounted(){
    //     setTimeout(() => {
    //         if(localStorage.getItem('Search')){
    //             this.search = localStorage.getItem('Search')
    //             localStorage.removeItem('Search')
    //             this.searchProduct()
    //         }
    //     },3000)
        
    // },
    data: {
      contactName: '',
      contactEmail:'',
      contactMessage: '',
      search: '',
      email: '',
      ocultar: false,
      urlHttp: 'https://brainmakers.net',
      currentProduct: null,
      valorFiltroMinimo: 100,
      valorFiltroMaximo: 500000,
      tienda: {},
      categorias: [],
      productos: [],
      productosFiltrados: [],
      banners: [],
      shoppingCart: [],
      counter: 1,
      message: 'Hello Vue!',

    },
    
    methods: {
        getData(){
            axios.get("https://brainmakers.net/api/front/tienda/229" ).then((response) => {
                this.tienda = response.data.data.tienda;
                document.documentElement.style.setProperty('--logo', `url("https://brainmakers.net/logos/${this.tienda.logo}")`);
                this.banners = response.data.data.banners;
                this.categorias = response.data.data.categorias;
                this.productos = response.data.data.productos;
                setTimeout(()=>{
                  global.Core.initialize();
                }, 200)
                this.timeSearch()
            })
        },
        getDataProducto(){
            var URLactual = window.location.href;
            var arrURL = URLactual.split("/", -1)
            var indexId = arrURL.length-1
            var idURL = arrURL[indexId]
            axios.get(`https://brainmakers.net/api/front/producto/${idURL}`).then((response) => {
                this.currentProduct = response.data;
                setTimeout(()=>{
                    global.Core.initialize();
                  }, 200)
                  
            });
        },
        render(){
            this.productosFiltrados = this.productos.filter(product => product.precio >= this.valorFiltroMinimo && product.precio <= this.valorFiltroMaximo)
        },
        sum(){
            this.counter = this.counter + 1
        },
        rest(){
            this.counter = this.counter - 1
        },
        addProductToCart() {
            let duplicateProduct = []
            for (let [index, valor] of this.shoppingCart.entries()) {
                if (this.currentProduct.detalle.id == valor.detalle.id) {
                    duplicateProduct = [index, valor]
                }
            }
            this.currentProduct.counter = this.counter;
           
             
            if (duplicateProduct.length !== 0) {
                this.shoppingCart[duplicateProduct[0]].counter += this.counter
                
            }else {
                this.shoppingCart.push(this.currentProduct)
            }
            this.refreshLocalStorage()
        },
        removeProduct(index){
            this.shoppingCart.splice(index, 1)
            this.refreshLocalStorage()
        },
        refreshLocalStorage(){
            localStorage.setItem('ShoppingCart', JSON.stringify(this.shoppingCart))
        },
        searchProduct(){

            var options = {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "nombre",
                ]
            };

            var fuse = new Fuse(this.productos, options)
            var search  = this.search
            this.productosFiltrados = fuse.search(search)
        },
        subscriptionNewsletter(){
            let params = {
                correo: this.email,
                tienda: 229,
            }
            axios.post('http://brainmakers.net/api/front/suscriptores', params).then((response) => {
                this.email = ""
            })
        },
        setInput(){    
            localStorage.setItem("Search", this.search)    
        },
        timeSearch(){
            this.search = localStorage.getItem('Search')
            localStorage.removeItem('Search')
            this.searchProduct()
        },
        submitContact(){
            let params = {
                nombre: this.contactName,
                correo: this.contactEmail,
                celular: 0,
                comentario: this.contactMessage,
                tienda: 229
            }
            axios.post('http://brainmakers.net/api/front/mensaje-contacto', params).then((response) => {
                
            })
        }


    },
    computed:{
        reverseImages: function () {
            return this.productos.slice(-5, this.productos.length).reverse()
        },
        sizeShoppingCart: function () {
            return this.shoppingCart.length
        }
    },
    filters: {
        formatNum: function (value) {
          return new Intl.NumberFormat().format(value);
        }
      },

    watch:{
        search: function(value) {
            this.searchProduct()
        }
      }
  })
