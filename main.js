// eventbus
const bus = new Vue();
let timer;
let timer2;
let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3568551/13134__looppool__toyhammer.wav');

// each row contains three mole blocks
// 每一行中有三個地鼠方塊
Vue.component("moles", {
  props: ["list", "url", "list-i"],
  template: `<div class="row">
                <mole v-for="mole in list" :mole="mole" :id="mole.id" :url="url" :list-i="listI"></mole>
             </div>`
});

// each mole block
// 每一個地鼠方塊
Vue.component("mole", {
  props: ["mole", "id", "url", "list-i"],
  template: `<div class="mole"><img v-show="mole.isMole" :src="url" @click="score"></div>`,
  methods: {
    score() {
      // passing id of mole and index of row
      // 引數為地鼠的id以及行數的index
      bus.$emit("score", this.id, this.listI);
    }
  }
});

let app = new Vue({
  el: "#app",
  data: {
    url:
      "https://tw.portal-pokemon.com/play/resources/pokedex/img/pm/de7c2ea1a9f39427b4732a6122284f257f9e87aa.png",
    moleLists: [
      [
        { id: 0, isMole: false },
        { id: 1, isMole: false },
        { id: 2, isMole: false }
      ],
      [
        { id: 3, isMole: false },
        { id: 4, isMole: false },
        { id: 5, isMole: false }
      ],
      [
        { id: 6, isMole: false },
        { id: 7, isMole: false },
        { id: 8, isMole: false }
      ]
    ],
    points: 0,
    level: "",
    isStart: false,
    time: 30000
  },
  computed: {
    delay() {
      // the higher the level, the faster the moles disappear
      // 難易度愈高，地鼠消失得愈快
      if (this.level == "0") return 1500;
      if (this.level == "1") return 1000;
      if (this.level == "2") return 800;
    }
  },
  methods: {
    // start game
    // 遊戲開始
    start() {
      if (this.level) {
        // console.log("start");
        timer = setInterval(this.randMole, 1000);
        timer2 = setInterval(() => {
          this.time -= 1000;
          // when there are 6 secs left, stop generating moles so that no moles appear after game has ended
          // 時間剩6秒的時候不再生產地鼠(以免時間到了地鼠才出現或還沒消失)
          if (this.time == 6000) {
            clearInterval(timer);
          }
          if (this.time == 0) {
            clearInterval(timer2);
          }
        }, 1000);
        this.isStart = true;
      }
    },
    reset() {
      this.time = 30000;
      this.isStart = false;
    },
    // show and hide mole
    // 地鼠的出現和消失
    randMole() {
      let a = Math.floor(Math.random() * 3);
      let b = Math.floor(Math.random() * 3);
      let rand = Math.ceil(Math.random() * 3);
      setTimeout(() => {
        this.moleLists[a][b].isMole = true;
        setTimeout(() => {
          this.moleLists[a][b].isMole = false;
        }, this.delay);
      }, rand * this.delay);
    }
  },
  mounted() {
    // hide mole when clicked on
    // 打到的地鼠會消失
    bus.$on("score", (id, listI) => {
      // console.log(id, listI);
      audio.play();
      let arr = this.moleLists[listI];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          arr[i].isMole = false;
          this.points += 1;
          // console.log(this.points);
        }
      }
    });
  }
});
