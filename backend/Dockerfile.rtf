{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\
WORKDIR /src\
\
# Copia o arquivo .csproj da subpasta interna\
COPY ["backend/backend.csproj", "backend/"]\
RUN dotnet restore "backend/backend.csproj"\
\
# Copia todo o resto do c\'f3digo\
COPY . .\
WORKDIR "/src/backend"\
RUN dotnet build "backend.csproj" -c Release -o /app/build\
\
FROM build AS publish\
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false\
\
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final\
WORKDIR /app\
COPY --from=publish /app/publish .\
ENTRYPOINT ["dotnet", "backend.dll"]}