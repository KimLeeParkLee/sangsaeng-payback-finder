# Multi-stage Dockerfile for Spring Boot (Gradle)
# 빌드 스테이지: Gradle Wrapper로 bootJar 생성
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /workspace

# Gradle 캐시 최적화를 위해 의존 파일 먼저 복사
COPY gradlew gradlew.bat build.gradle settings.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew

# 소스 복사 후 빌드
COPY src ./src
RUN ./gradlew --no-daemon clean bootJar -x test

# 부트 JAR만 식별해 고정 이름으로 복사(-plain 제외)
RUN JAR=$(ls build/libs/*-SNAPSHOT.jar | grep -v plain | head -n1) \
    && cp "$JAR" /workspace/app.jar

# 런타임 스테이지: 경량 JRE 이미지 사용
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 런타임 환경설정
ENV TZ=Asia/Seoul
ENV JAVA_TOOL_OPTIONS=""

# 보안을 위해 비루트 사용자로 실행
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# 애플리케이션 JAR 복사 (적절한 소유권으로)
COPY --chown=appuser:appuser --from=builder /workspace/app.jar ./app.jar

# 컨테이너 포트(기본 Spring Boot 8080)
EXPOSE 8080

# 애플리케이션 실행 (쉘 래퍼 없이 exec 형식)
ENTRYPOINT ["java","-jar","app.jar"]
