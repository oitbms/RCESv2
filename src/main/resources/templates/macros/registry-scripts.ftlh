<#-- DRY: единая загрузка jQuery + bundled registry-модуля (SOLID/DRY) -->
<#macro registryScripts module>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/dist/${module}.js" defer></script>
</#macro>
