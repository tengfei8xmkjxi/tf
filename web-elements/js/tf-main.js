/* ==========================================================================
   tf-main.js — 页面交互脚本（原生 JS，无任何依赖）
   学号：24001010528    姓名：滕菲
   --------------------------------------------------------------------------
   负责四件事：
     1. 导航栏滚动变实心（rAF 节流，只增删 class，不改内联样式）
     2. 导航按钮平滑滚动到对应版块
     3. 统计数字从 0 滚动到目标值（IntersectionObserver 触发一次）
     4. 柱状图进入视口后按顺序生长
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 导航栏滚动态 ---------- */
  var header = document.querySelector('.tf-header');
  var ticking = false;

  function syncHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle('tf-header--solid', window.scrollY > 40);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(syncHeader);
  }, { passive: true });

  syncHeader();

  /* ---------- 2. 平滑滚动 ---------- */
  var scrollTriggers = document.querySelectorAll('[data-tf-scroll]');

  Array.prototype.forEach.call(scrollTriggers, function (trigger) {
    trigger.addEventListener('click', function () {
      var target = document.querySelector('.tf-section--' + trigger.dataset.tfScroll);
      var heroTarget = trigger.dataset.tfScroll === 'hero' ? document.querySelector('.tf-hero') : null;
      var node = target || heroTarget;

      if (!node) {
        return;
      }

      window.scrollTo({
        top: node.getBoundingClientRect().top + window.scrollY - 8,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ---------- 3. 数字滚动 ---------- */
  var counters = document.querySelectorAll('.tf-stat__num');

  function runCounter(node) {
    var target = Number(node.dataset.tfCount || 0);
    var duration = 1500;
    var startedAt = null;

    if (reduceMotion) {
      node.textContent = String(target);
      return;
    }

    function step(now) {
      if (startedAt === null) {
        startedAt = now;
      }
      var progress = Math.min((now - startedAt) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      node.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    node.textContent = '0';
    window.requestAnimationFrame(step);
  }

  /* ---------- 4. 进入视口再播放 ---------- */
  function onEnter(node, callback) {
    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        callback();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.28 });

    observer.observe(node);
  }

  Array.prototype.forEach.call(counters, function (node) {
    onEnter(node.closest('.tf-stat') || node, function () {
      runCounter(node);
    });
  });

  var chart = document.querySelector('.tf-chart');
  if (chart) {
    onEnter(chart, function () {
      chart.classList.add('tf-chart--visible');
    });
  }

  /* ---------- 5. 给后面可能加的动态内容留个口子 ---------- */
  root.classList.add('tf-js-ready');
}());
