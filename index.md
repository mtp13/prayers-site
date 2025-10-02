---
layout: default
title: Rosary Prayers
---

# {{ page.title }}

Welcome to the Rosary Prayers page. Below are the prayers commonly recited
during the Rosary devotion.

## Today's Mystery

{% assign current_day = 'now' | date: '%u' %}
{% assign mystery_for_today = '' %}
{% assign mystery_post = '' %}

{% if current_day == '1' %}
  {% assign mystery_for_today = 'Joyful Mysteries' %}
{% elsif current_day == '2' %}
  {% assign mystery_for_today = 'Sorrowful Mysteries' %}
{% elsif current_day == '3' %}
  {% assign mystery_for_today = 'Glorious Mysteries' %}
{% elsif current_day == '4' %}
  {% assign mystery_for_today = 'Luminous Mysteries' %}
{% elsif current_day == '5' %}
  {% assign mystery_for_today = 'Sorrowful Mysteries' %}
{% elsif current_day == '6' %}
  {% assign mystery_for_today = 'Joyful Mysteries' %}
{% elsif current_day == '7' %}
  {% assign mystery_for_today = 'Glorious Mysteries' %}
{% endif %}

{% for mystery in site.mysteries %}
  {% if mystery.title contains mystery_for_today %}
    {% assign mystery_post = mystery %}
    {% break %}
  {% endif %}
{% endfor %}

{% if mystery_post %}
{% include todays-mystery.html %}
{% endif %}

## Rosary Prayers

<ul>
{% assign sorted_prayers = site.prayers | sort: 'order' %}
{% for prayer in sorted_prayers %}
  <li><a href="{{ prayer.url }}">{{ prayer.title }}</a></li>
{% endfor %}
</ul>

## All Mysteries

<ul>
{% assign sorted_mysteries = site.mysteries | sort: 'order' %}
{% for mystery in sorted_mysteries %}
  <li><a href="{{ mystery.url }}">{{ mystery.title }}</a></li>
{% endfor %}
</ul>
