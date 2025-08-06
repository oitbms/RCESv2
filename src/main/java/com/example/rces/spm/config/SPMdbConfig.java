package com.example.rces.spm.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.rces.spm",
        entityManagerFactoryRef = "spmEntityManager",
        transactionManagerRef = "spmTransactionManager"
)
public class SPMdbConfig {

    @Bean(name = "spmEntityManagerFactory")
    @Primary
    public EntityManagerFactory spmEntityManagerFactory(
            @Qualifier("spmEntityManager") LocalContainerEntityManagerFactoryBean factoryBean) {
        return factoryBean.getObject();
    }

    @Bean
    @ConfigurationProperties("app.datasource.spm")
    public DataSourceProperties spmDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @ConfigurationProperties("app.datasource.spm.configuration")
    public DataSource spmDataSource() {
        return spmDataSourceProperties()
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "spmEntityManager")
    public LocalContainerEntityManagerFactoryBean spmEntityManager(
            EntityManagerFactoryBuilder builder,
            @Qualifier("spmDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.example.rces.spm.models")
                .persistenceUnit("spm")
                .properties(jpaProperties())
                .build();
    }

    private Map<String, Object> jpaProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.boot.allow_jdbc_metadata_access", "true");
        props.put("hibernate.jdbc.lob.non_contextual_creation", "true");
        return props;
    }


    @Bean(name = "spmTransactionManager")
    public PlatformTransactionManager spmTransactionManager(
            @Qualifier("spmEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}