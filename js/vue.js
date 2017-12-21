
Vue.use(SocialSharing);
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
    data: {
      ocultar: false,
      urlHttp: 'https://brainmakers.net',
      currentProduct: null,
      valorFiltroMinimo: 100,
      valorFiltroMaximo: 500000,
      tienda: {},
      categorias:[],
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
        removeProduct(){
            // eliminar producto
        },
        refreshLocalStorage(){
            localStorage.setItem('ShoppingCart', JSON.stringify(this.shoppingCart))
        },


    },
    computed:{
        reverseImages: function () {
            return this.productos.slice(-5, this.productos.length).reverse()
        }
    },
    filters: {
        formatNum: function (value) {
          return new Intl.NumberFormat().format(value);
        }
      }
  })
