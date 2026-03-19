# 听听看 TīngTīngKàn - 产品需求文档

## Overview
- **Summary**: 面向学中文的外国人的听力训练工具，通过播放中文音频描述，展示两张相似但有细节差异的图片，用户听完后选出正确的那张，包含拼音和英文翻译辅助。
- **Purpose**: 提供有趣、互动的听力练习方式，帮助用户提高中文听力理解能力，通过视觉辅助增强记忆效果。
- **Target Users**: 正在学习中文的外国人，HSK 1-4级水平的学习者，希望通过趣味方式提高听力的用户。

## Goals
- 提供不同难度级别的听力练习
- 实现语音合成功能，播放中文描述
- 展示对比图片，让用户选择正确答案
- 提供即时反馈，包括正确/错误判断、原文、拼音和翻译
- 实现完整的答题流程和结算系统
- 确保响应式设计，支持不同设备

## Non-Goals (Out of Scope)
- 后端服务
- 用户账户系统
- 数据持久化（除本地存储外）
- 多语言支持（仅英文辅助）
- 第三方API集成（除Web Speech API外）

## Background & Context
- 目标用户为HSK 1-4级的中文学习者
- 使用Web Speech API实现语音合成
- 使用Web Audio API生成音效反馈
- 纯前端实现，无需后端服务

## Functional Requirements
- **FR-1**: 难度选择功能 - 提供初级、中级、高级三个难度级别
- **FR-2**: 答题系统 - 展示两张对比图片，用户选择答案
- **FR-3**: 语音合成 - 播放中文描述音频
- **FR-4**: 答题反馈 - 显示正确/错误判断、原文、拼音和翻译
- **FR-5**: 结算系统 - 显示总分和答题回顾
- **FR-6**: 音效反馈 - 正确/错误时播放不同音效
- **FR-7**: 响应式设计 - 适配不同设备尺寸

## Non-Functional Requirements
- **NFR-1**: 性能 - 页面加载时间<3秒，操作响应时间<1秒
- **NFR-2**: 兼容性 - 支持主流浏览器和移动设备
- **NFR-3**: 可用性 - 操作简单直观，适合目标用户使用
- **NFR-4**: 视觉设计 - 界面美观，符合设计要求

## Constraints
- **Technical**: 纯HTML + CSS + JavaScript实现，使用Web Speech API和Web Audio API
- **Business**: 无特殊业务约束
- **Dependencies**: 依赖浏览器支持Web Speech API

## Assumptions
- 目标用户使用支持Web Speech API的现代浏览器
- 用户具备基本的中文听力能力（HSK 1-4水平）
- 网络连接稳定，能够加载图片和音频

## Acceptance Criteria

### AC-1: 难度选择功能
- **Given**: 用户打开应用
- **When**: 用户选择难度级别
- **Then**: 系统加载对应难度的题目
- **Verification**: `programmatic`
- **Notes**: 三个难度级别分别对应HSK 1-2、HSK 3、HSK 4

### AC-2: 答题系统
- **Given**: 用户进入答题页面
- **When**: 用户听取音频并选择图片
- **Then**: 系统记录用户选择并判断对错
- **Verification**: `programmatic`
- **Notes**: 图片在桌面端左右并排，移动端上下排列

### AC-3: 语音合成
- **Given**: 用户点击播放按钮
- **When**: 系统生成并播放中文音频
- **Then**: 用户能听到清晰的中文描述
- **Verification**: `human-judgment`
- **Notes**: 不同难度对应不同语速

### AC-4: 答题反馈
- **Given**: 用户选择答案
- **When**: 系统判断答案
- **Then**: 系统显示正确/错误提示、原文、拼音和翻译
- **Verification**: `programmatic`
- **Notes**: 错误时高亮关键词

### AC-5: 结算系统
- **Given**: 用户完成所有题目
- **When**: 系统计算得分
- **Then**: 系统显示总分和答题回顾
- **Verification**: `programmatic`
- **Notes**: 提供"再来一次"和"换个难度"按钮

### AC-6: 音效反馈
- **Given**: 用户选择答案
- **When**: 系统判断答案
- **Then**: 系统播放相应的音效
- **Verification**: `human-judgment`
- **Notes**: 正确播放"叮咚"音效，错误播放"嗡嗡"音效

### AC-7: 响应式设计
- **Given**: 用户在不同设备上打开应用
- **When**: 系统检测设备尺寸
- **Then**: 系统调整布局以适应设备
- **Verification**: `human-judgment`
- **Notes**: 桌面端和移动端布局不同

## Open Questions
- [ ] 图片资源如何获取和管理？
- [ ] 题库内容如何扩展和更新？
- [ ] 如何处理Web Speech API不支持的浏览器？