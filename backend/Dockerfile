FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY src src

RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

# EC2 t3.small(2GB) 기준 힙 메모리 설정
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]
