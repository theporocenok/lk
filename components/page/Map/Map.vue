<template>
  <div>
    <v-card-title>{{ $t('map.title') }}</v-card-title>
    <div class="map-wrapper">
      <!--{{ objects }}-->
      <div
        id="map"
        class="map"
        style="height: 600px;width:100%;"
      />
      <div
        v-if="selectedItems"
        class="map__selected-items"
      >
        <h4>{{ $t('map.selected_elements') }}</h4>
        
        <div
          v-for="(item, i) in selectedItems"
          :key="i"
          class="map__selected-items--wrapper"
        >
          <div
            class="map__selected-items--title"
            :data-id="item.id"
          >
            <router-link
              class="text-muted"
              :to="'/object/'+item.id+'/monitoring'"
              @click="goTo(item.id)"
            >
              {{ item.title }}
            </router-link>
          </div>
          <div class="map__selected-items--sensors">
            <i
              v-for="(icon, k) in item.table"
              :key="k"
              :class="[
                'v-icon notranslate mdi theme--light',
                icon.icon,
                icon.is_online ? 'green--text' : 'red--text',
              ]"
              :title="icon.title"
            />
          </div>
        </div>
      </div>
    </div>
    
    <v-subheader class="pl-0">
      {{ $t('map.claster_text') }}
    </v-subheader>
    <v-slider
      v-model="distance"
      thumb-size="24"
      thumb-label="always"
    />
  </div>
</template>

<script>
  import '../../../plugins/ol/ol.css';
  import Feature from 'ol/Feature';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import Point from 'ol/geom/Point';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  import {Cluster, OSM, Vector as VectorSource} from 'ol/source';
  import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
  import Select from 'ol/interaction/Select.js';
  import {fromLonLat} from 'ol/proj.js';


  export default {
    name: 'Map',
    filter: {
      renter_id: "",
      equipment_type_id: "",
      city_id: "",
      equipment_manufacturer_id: "",
      equipment_model_id: "",
      text: ""
    },
    components: {},
    data() {
      return {
        objects: [],
        
        mapObject: false,
        mapSource: false,
        
        selectedItems: false,
        routeState: false,
        distance: 40,
        clusterSource: {}
      };
    },
    computed: {
      renterId() {
        return this.$store.state.renterId;
      },
      equipmentTypeId() {
        return this.$store.state.equipmentTypeId;
      },
      cityId() {
        return this.$store.state.cityId;
      },
      equipmentManufacturerId() {
        return this.$store.state.equipmentManufacturerId;
      },
      equipmentModelId() {
        return this.$store.state.equipmentModelId;
      },
      equipmentSearch() {
        return this.$store.state.equipmentSearch;
      },
    },
    watch: {
      distance(newDistance) {
        this.clusterSource.setDistance(parseInt(newDistance, 10));
      },
      async renterId(v) {
        this.filter.renter_id = v;
        // load map
      },
      async equipmentTypeId(v) {
        this.filter.equipment_type_id = v;
        // load map
      },
      async cityId(v) {
        this.filter.city_id = v;
        // load map
      },
      async equipmentManufacturerId(v) {
        this.filter.equipment_manufacturer_id = v;
        // load map
      },
      async equipmentModelId(v) {
        this.filter.equipment_model_id = v;
        // load map
      },
      async equipmentSearch(v) {
        this.filter.text = v;
        // load map
      },
    },
    mounted() {
      // this.loadObjects();

        this.initOSMMap();
        this.loadObjects();
    },





    methods: {
      initOSMMap(){
          if (!process.browser) return;

          // const moscow = fromLonLat([37.6178, 55.7517]);
          const tyumen = fromLonLat([65.5221, 57.1455]);


          function getStyleFeature(feature, selected = false) {
              var size = feature.get('features').length;

              var setColor;
              if (selected == true) {
                  setColor = '#ff9800';
              } else if (size > 1) {
                  // значит это кластер, надо найти is_online=0, тогда красим в красный цвет
                  // иначе красим в зеленый по умолчанию
                  setColor = '#4caf50';
                  // feature.values_.features.forEach(function (item) {
                  //     if (item.get("is_online") != "1") {
                  //         setColor = '#ff0000';
                  //     }
                  // });
              } else {
                  // это не кластер, от состояния зависит цвет, красный #ff0000 или зеленый #3399CC
                  setColor = '#4caf50';
                  // setColor = feature.values_.features[0].get("is_online") == "1" ? '#4caf50' : '#ff0000';
              }

              var style = new Style({
                  image: new CircleStyle({
                      radius: 8,
                      stroke: new Stroke({
                          color: '#fff'
                      }),
                      fill: new Fill({
                          color: setColor
                      })
                  }),
                  text: new Text({
                      text: size > 1 ? size.toString() : feature.values_.features[0].get("title"),
                      offsetX: 12,
                      textAlign: 'left',
                      fill: new Fill({
                          color: '#000'
                      })
                  })
              });
              return style;
          }

          var mapFeatures = [];
          this.mapSource = new VectorSource({
              features: mapFeatures
          });


          let clusterSource = new Cluster({
              distance: parseInt(this.distance, 10),
              source: this.mapSource
          });

          this.clusterSource = clusterSource;

          var $this = this;
          var clusters = new VectorLayer({
              source: clusterSource,
              style: function (feature) {
                  return getStyleFeature(feature);
              }
          });

          var raster = new TileLayer({
              source: new OSM()
          });

          this.mapObject = new Map({
              layers: [raster, clusters],
              target: 'map',
              view: new View({
                  center: tyumen,
                  zoom: 8
              })
          });

          this.clusterSource.setDistance(parseInt(this.distance, 10));

          var displayFeatureInfo = function (pixel) {

              $this.selectedItems = false;
              var list = [];
              $this.mapObject.forEachFeatureAtPixel(pixel, function (feature) {
                  feature.get('features').map(function (item) {
                      list.push(item.get("id"));
                  });
              });

              return list;
          };

          this.mapObject.on('click', function (evt) {
              var pixel = evt.pixel;

              //var coords = $this.mapObject.getCoordinateFromPixel(pixel);
              var list = displayFeatureInfo(pixel);
              if (list.length > 0) {
                  $this.getList(list);
              }
          });


          var selectInteraction = new Select({
              //some options
          });
          this.mapObject.addInteraction(selectInteraction);

          selectInteraction.on("select", function (evt) {
              var selected = evt.selected;
              var deselected = evt.deselected;

              if (selected.length) {
                  selected.forEach(function (feature) {
                      var style_modify = getStyleFeature(feature, true);
                      feature.setStyle(style_modify);
                  });
              } else {
                  deselected.forEach(function (feature) {
                      var style_modify = getStyleFeature(feature);
                      feature.setStyle(style_modify);
                  });
              }
          });


      },
      async loadObjects() {
        const {data} = (await this.$api.CityObjectField.map(this.filter)).data;
        
        this.objects = data;
      },
      async refreshObjects() {
        this.mapSource.clear();
        this.objects.map((item) => {
          var iconFeature = new Feature({
            geometry: new Point(fromLonLat([item.lat, item.lng]))
          });
          iconFeature.setProperties({
            id: item.id,
            title: item.title,
            code: item.code,
            icon: item.icon,
            name: item.name,
            is_online: item.is_online,
          });
          
          this.mapSource.addFeature(iconFeature);
        });
        
        this.mapCenterZoom();
        
        
      },
      mapCenterZoom() {
        let extent = this.mapSource.getExtent();
        this.mapObject.getView().fit(extent, {
          padding: [50, 50, 50, 50] // Padding (in pixels) to be cleared inside the view. Values in the array are top, right, bottom and left padding.
        });
        let zoomSize = this.mapObject.getView().getZoom();
        this.mapObject.getView().setZoom(Math.min(15, zoomSize));
      }
    }
    
  };

</script>

<style scoped>
  .map-wrapper{ position: relative; }
  .map__selected-items{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 230px;
    min-height: 110px;
    background: #fff;
    border: solid 1px #adadad;
    opacity: 0.6;
    padding: 10px;
    max-height: calc(100% - 50px);
    overflow-y: auto;
  }
  
  .map__selected-items--wrapper{
    margin-top: 10px;
    border: solid 1px #acacac;
    padding: 5px;
  }
  .map__selected-items--title{
    font-size: 13px;
  }
  .map__selected-items--sensors i{
    font-size: 18px;
  }
</style>