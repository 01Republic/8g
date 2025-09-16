#!/usr/bin/env node

/**
 * 기존 데이터베이스에서 TypeORM 엔티티를 자동 생성하는 스크립트
 * 
 * 사용법:
 * 1. .env 파일에 DB 연결 정보 설정
 * 2. npm run db:generate-entities 실행
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';
import path from 'path';

// .env 파일 로드
config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || '';

if (!DB_NAME) {
  console.error('❌ DB_NAME 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'app/api/db/entities');

const command = [
  'npx typeorm-model-generator',
  `-h ${DB_HOST}`,
  `-d ${DB_NAME}`,
  `-p ${DB_PORT}`,
  `-u ${DB_USER}`,
  DB_PASSWORD ? `-x ${DB_PASSWORD}` : '',
  `-e mysql`,
  `-o ${outputDir}`,
  '--noConfig',
  '--cf pascal',
  '--ce pascal',
  '--cp camel',
  '--skipSchema',
  '-a',
  '--skipTables=typeorm_metadata,migrations'
].filter(Boolean).join(' ');

try {
  console.log('🔄 데이터베이스에서 엔티티 생성 중...');
  console.log(`데이터베이스: ${DB_NAME}`);
  console.log(`출력 디렉토리: ${outputDir}`);
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ 엔티티 생성 완료!');
  console.log(`📁 생성된 파일들을 ${outputDir}에서 확인하세요.`);
  console.log('');
  console.log('다음 단계:');
  console.log('1. 생성된 엔티티 파일들을 검토하고 필요에 따라 수정');
  console.log('2. app/api/db/entities/index.ts에서 엔티티들을 export');
  console.log('3. 애플리케이션에서 엔티티 사용');
  
} catch (error) {
  console.error('❌ 엔티티 생성 중 오류 발생:', error.message);
  console.log('');
  console.log('문제 해결 방법:');
  console.log('1. 데이터베이스 연결 정보 확인');
  console.log('2. 데이터베이스 서버 실행 상태 확인');
  console.log('3. 사용자 권한 확인');
  process.exit(1);
}