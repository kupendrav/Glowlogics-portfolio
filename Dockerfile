FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/portfolio-0.0.1-SNAPSHOT.jar app.jar
COPY render-start.sh render-start.sh

RUN chmod +x /app/render-start.sh

EXPOSE 10000

CMD ["./render-start.sh"]
