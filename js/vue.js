var app = new Vue({
    el: '#app',
    created(){
        this.getData();
        this.getDataProducto();
    },
    data: {
      currentProduct: null,
      valorFiltroMinimo: 100,
      valorFiltroMaximo: 500000,
      tienda: {},
      categorias:[],
      productos: [],
      productosFiltrados: [],
      banners: [],
      message: 'Hello Vue!'
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
            axios.get(`https://brainmakers.net/api/front/producto/956`).then((response) => {
                this.currentProduct = response.data;
                setTimeout(()=>{
                    global.Core.initialize();
                  }, 200)
            });
        },
        render(){
            this.productosFiltrados = this.productos.filter(product => product.precio >= this.valorFiltroMinimo && product.precio <= this.valorFiltroMaximo)
        }
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
