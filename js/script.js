'use strict';

//スライダー卵型
//スライダー卵型 (リッチデザイン化)
$(document).ready(function () {
  $(".slider").slick({
    autoplay: true, //自動スライド
    autoplaySpeed: 3000, //スライドの再生速度
    speed: 800, //スライド切り替え速度
    dots: true, //ドットインジケーター表示
    arrows: false, //左右矢印は非表示（デザインによる）
    centerMode: true, //センターモード有効化
    centerPadding: '15%', //PC: 余白を減らして中央表示領域を約70%まで拡大
    slidesToShow: 1, //PCでも1枚をメインにする
    pauseOnFocus: false,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    responsive: [
      {
        breakpoint: 768, //スマホ・タブレット
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '40px', //スマホ調整
        }
      }
    ]
  });
});

// スクロールアニメーション (Intersection Observer)
document.addEventListener("DOMContentLoaded", function () {
  // IntersectionObserver設定
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // 少し見えたら発火（軽快に）
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 一度表示したら監視終了
      }
    });
  }, observerOptions);

  // 監視対象の要素
  const targets = document.querySelectorAll('.fade-in-up');
  targets.forEach(target => {
    observer.observe(target);
  });
});

//ページトップボタン
$(function () {
  $('.page-top').hide(); //TOPページトップボタン非表示

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) { //スクロールが100より大きい場合
      $('.page-top').fadeIn();//フェードイン
    } else {
      $('.page-top').fadeOut();//フェードアウト
    }
  });

  $('.page-top').click(function () {
    $('body,html').animate({ scrollTop: 0 }, 500); //TOPへスクロール
    return false;
  });
});

//ページ内リンクメニューをクリックした後ブラウザバックしてもメニューを開かなくする
$(function () {
  $('.page_link a').on('click', function () {
    $('#input').prop('checked', false);
  });
});

//HBメニュー内body固定
$(function () {
  let flag = false;
  $('#nav_open').on('click', function () {
    if (flag == false) {
      bodyFix(); // bodyを固定させる関数

      // その他、ナビを開くときに起きるあれこれを記述

      flag = true;
    } else {
      closeNavi();
      flag = false;
    }
  });
});

//HBメニュー閉じたあとスクロールを元に戻す関数
function closeNavi() {
  bodyFixReset(); // body固定を解除する関数

}

//メニュー表示時bodyを固定する関数
function bodyFix() {
  const scrollPosi = $(window).scrollTop();
  $('body').css({
    'position': 'fixed',
    'width': '100%',
    'z-index': '1',
    'top': -scrollPosi,
  });
};


//メニュー閉じた後body固定を解除する関数
function bodyFixReset() {
  const scrollPosi = $('body').offset().top;
  $('body').css({
    'position': 'absolute',
    'width': '100%',
    'top': 'scrollPosi',
  });
  //scroll位置を調整
  $('html, body').scrollTop(-scrollPosi);
};
//---------------------------------------------------------
// DOM Ready
$(function () {

  // モーダルの設定（自動オープンの前に初期化が必要）
  $(".video-open").modaal({
    type: 'iframe', // 自動解析ではなくiframeとして直接表示
    width: 800,     // iframeの幅
    height: 450,    // iframeの高さ
    background: '#f3f3e3',
    overlay_close: true,
    loading_content: 'Loading video...',
    before_open: function () {
      $('html').css('overflow-y', 'hidden');
      $('#floatingVideoBtn').fadeOut();
    },
    after_close: function () {
      $('html').css('overflow-y', 'scroll');
      $('#floatingVideoBtn').fadeIn();
    },
    error: function (e) {
      console.error("Modaal Error:", e);
    }
  });

  // フローティングボタンクリックでモーダルを開く
  $('#floatingVideoBtn').on('click', function () {
    $('.video-open').modaal('open');
  });

  // 自動オープン：DOM準備完了から1.5秒後に開く（Load待ちはしない）
  /*
  setTimeout(function () {
    console.log("Auto opening video modal...");
    $('.video-open').modaal('open');
  }, 1500);
  */

  // モーダル自動オープンを無効にしたため、ボタンを初期表示する
  setTimeout(function () {
    $('#floatingVideoBtn').fadeIn();
  }, 1000);

});

// ページが完全に閉じられる前にセッションストレージをクリア（念のため残す）
window.addEventListener('beforeunload', function () {
  sessionStorage.removeItem("modalShown");
});

// NEWSの日付フィルタリング（6ヶ月以前のものを非表示）
document.addEventListener("DOMContentLoaded", function () {
  const newsItems = document.querySelectorAll('.news_item');
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  newsItems.forEach(function (item) {
    const timeElement = item.querySelector('time');
    if (timeElement) {
      const newsDateStr = timeElement.getAttribute('datetime');
      const newsDate = new Date(newsDateStr);

      if (newsDate < sixMonthsAgo) {
        item.style.display = 'none';
      }
    }
  });
});