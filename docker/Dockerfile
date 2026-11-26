# Espelha o servidor da Medscape: Debian + Apache + PHP (mesma versão do HPN e do Opella).
FROM php:8.1-apache

RUN docker-php-ext-install pdo_mysql \
 && a2enmod rewrite headers expires \
 && sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
