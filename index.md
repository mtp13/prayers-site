---
layout: default
title: Rosary Prayers
---
# {{ page.title}}

Welcome to the Rosary Prayers page.  Below are the prayers commonly recited during the Rosary devotion.

<ul>
{% assign sorted_prayers = site.prayers | sort: 'order' %}
{% for prayer in sorted_prayers %}
  <li><a href="{{ prayer.url }}">{{ prayer.title }}</a></li>
{% endfor %}
</ul>
