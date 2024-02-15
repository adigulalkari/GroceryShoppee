import ProductCard from "./ProductCard.js";

export default {
    props: {
        products: {
            type: Array,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    },
    template: `
        <div :id="carouselId" class="carousel carousel-dark slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div v-for="(chunk, index) in chunkedProducts" :key="index" :class="['carousel-item', { 'active': index === 0 }]">
                    <div class="d-flex justify-content-between">
                        <ProductCard v-for="(product, idx) in chunk" :key="product.id + '-' + idx" :product="product" class="card" />
                        <div v-if="chunk.length < 3" v-for="i in 3 - chunk.length" :key="i" class="card" style="visibility: hidden;"></div>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" :href="'#' + carouselId" data-bs-slide="prev" style="left: -100px;">
                <span class="carousel-control-prev-icon" aria-hidden="true" style="color: black;"></span> <!-- Set arrow color to black -->
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" :href="'#' + carouselId" data-bs-slide="next" style="right: -100px;">
                <span class="carousel-control-next-icon" aria-hidden="true" style="color: black;"></span> <!-- Set arrow color to black -->
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `,
    computed: {
        carouselId() {
            return `carousel-${this.category}`; // Generating unique carousel ID based on category
        },
        chunkedProducts() {
            // Chunk products array into arrays of 3 items each
            return this.products.reduce((resultArray, item, index) => { 
                const chunkIndex = Math.floor(index / 3);
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = []; // Start a new chunk
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, []);
        }
    },
    components: {
        ProductCard
    }
};
