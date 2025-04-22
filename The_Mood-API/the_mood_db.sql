-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2024 at 01:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_mood_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parent_comment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `mood_id`, `content`, `created_at`, `updated_at`, `parent_comment_id`) VALUES
(1, 2, 7, 'try comment 1 #napakaangas ', '2024-10-28 17:35:26', '2024-10-28 17:35:26', NULL),
(2, 2, 7, 'try comment 1 #napakaangas ', '2024-10-28 17:35:29', '2024-10-28 17:35:29', NULL),
(3, 2, 7, 'try comment 1 #napakaangas ', '2024-10-28 17:54:47', '2024-10-28 17:54:47', NULL),
(4, 2, 7, 'try comment 1 #napakaangasmo ', '2024-10-28 17:54:55', '2024-10-28 17:54:55', NULL),
(5, 2, 7, 'try comment 1 #napakaangasmo ', '2024-10-28 17:54:59', '2024-10-28 17:54:59', NULL),
(6, 2, 7, 'try comment 1 #napakaangasmo ', '2024-10-28 17:55:20', '2024-10-28 17:55:20', NULL),
(7, 2, 7, 'try comment 1 #mangjose ', '2024-10-28 17:58:01', '2024-10-28 17:58:01', NULL),
(8, 1, 34, 'comment #testing', '2024-11-01 03:06:09', '2024-11-01 03:06:09', NULL),
(9, 1, 34, 'comment #testing', '2024-11-01 03:06:13', '2024-11-01 03:06:13', NULL),
(10, 1, 34, 'comment 1 #testing', '2024-11-01 03:06:22', '2024-11-01 03:06:22', NULL),
(11, 1, 34, 'comment 2 #testing', '2024-11-01 03:06:31', '2024-11-01 03:06:31', NULL),
(12, 1, 34, 'comment 3 #testing', '2024-11-01 03:06:36', '2024-11-01 03:06:36', NULL),
(13, 1, 38, 'comment 01 #testing', '2024-11-01 03:35:09', '2024-11-01 03:35:09', NULL),
(14, 1, 32, 'comment 02 #testing', '2024-11-01 03:35:17', '2024-11-01 03:35:17', NULL),
(15, 1, 39, 'comment 02 #testing', '2024-11-01 03:35:34', '2024-11-01 03:35:34', NULL),
(16, 3, 32, 'comment', '2024-11-03 13:13:32', '2024-11-03 13:13:32', NULL),
(17, 2, 44, 'comment (reply here)', '2024-11-04 13:50:36', '2024-11-04 13:50:36', NULL),
(18, 1, 44, 'reply #banana', '2024-11-04 13:53:04', '2024-11-04 13:53:04', 17),
(20, 1, 44, 'comment', '2024-11-04 14:49:19', '2024-11-04 14:49:19', 17),
(21, 1, 44, 'comment', '2024-11-04 14:58:54', '2024-11-04 14:58:54', 17),
(22, 1, 21, 'comment', '2024-11-04 14:59:14', '2024-11-04 14:59:14', 17),
(23, 1, 21, 'comment', '2024-11-04 14:59:22', '2024-11-04 14:59:22', 17),
(24, 1, 22, 'comment', '2024-11-04 14:59:35', '2024-11-04 14:59:35', 17),
(25, 1, 23, 'comment', '2024-11-04 14:59:55', '2024-11-04 14:59:55', 17),
(26, 1, 44, 'comment #bossSeth', '2024-11-04 15:01:22', '2024-11-04 15:01:22', NULL),
(27, 1, 44, 'reply sa commnet ba #bossSeth', '2024-11-04 15:01:51', '2024-11-04 15:01:51', 26);

-- --------------------------------------------------------

--
-- Table structure for table `comment_hashtags`
--

CREATE TABLE `comment_hashtags` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment_hashtags`
--

INSERT INTO `comment_hashtags` (`id`, `comment_id`, `hashtag_id`) VALUES
(1, 3, 1),
(2, 4, 15),
(3, 5, 15),
(4, 6, 15),
(5, 7, 21),
(6, 8, 27),
(7, 9, 27),
(8, 10, 27),
(9, 11, 27),
(10, 12, 27),
(11, 13, 27),
(12, 14, 27),
(13, 15, 27),
(14, 18, 45),
(15, 26, 46),
(16, 27, 46);

-- --------------------------------------------------------

--
-- Table structure for table `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment_likes`
--

INSERT INTO `comment_likes` (`id`, `user_id`, `comment_id`, `created_at`) VALUES
(7, 1, 17, '2024-11-04 14:58:35');

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followee_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`id`, `follower_id`, `followee_id`, `created_at`) VALUES
(3, 1, 1, '2024-11-03 12:49:24'),
(5, 2, 1, '2024-11-05 12:01:38'),
(6, 2, 2, '2024-11-05 12:01:45'),
(7, 2, 3, '2024-11-05 12:13:08'),
(10, 2, 4, '2024-11-05 12:13:31'),
(12, 2, 6, '2024-11-05 12:25:18');

-- --------------------------------------------------------

--
-- Table structure for table `hashtags`
--

CREATE TABLE `hashtags` (
  `id` int(11) NOT NULL,
  `tag` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hashtags`
--

INSERT INTO `hashtags` (`id`, `tag`) VALUES
(45, 'banana'),
(46, 'bossSeth'),
(21, 'mangjose'),
(1, 'napakaangas'),
(15, 'napakaangasmo'),
(23, 'new'),
(27, 'testing'),
(35, 'testing2'),
(24, 'yeye');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `mood_id`, `created_at`) VALUES
(1, 1, 44, '2024-11-04 14:25:49');

-- --------------------------------------------------------

--
-- Table structure for table `moods`
--

CREATE TABLE `moods` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `original_mood_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `moods`
--

INSERT INTO `moods` (`id`, `user_id`, `content`, `created_at`, `updated_at`, `original_mood_id`) VALUES
(1, 1, 'try 1 #napakaangas ', '2024-10-28 17:12:19', '2024-10-28 17:12:19', NULL),
(2, 1, 'try 2 #napakaangas ', '2024-10-28 17:12:33', '2024-10-28 17:12:33', NULL),
(3, 1, 'try 2 #napakaangas ', '2024-10-28 17:24:14', '2024-10-28 17:24:14', NULL),
(4, 1, 'try 4 #napakaangas ', '2024-10-28 17:25:35', '2024-10-28 17:29:59', NULL),
(5, 1, 'try 2 #napakaangas ', '2024-10-28 17:25:37', '2024-10-28 17:25:37', NULL),
(6, 1, 'try 2 #napakaangas ', '2024-10-28 17:28:29', '2024-10-28 17:28:29', NULL),
(7, 1, 'try 3 #napakaangas ', '2024-10-28 17:28:44', '2024-10-28 17:28:44', NULL),
(8, 2, 'try 2 #napakaangas ', '2024-10-28 17:32:04', '2024-10-28 17:32:04', NULL),
(9, 2, 'try 2 #napakaangas ', '2024-10-28 17:32:06', '2024-10-28 17:32:06', NULL),
(10, 1, 'post to repost', '2024-10-28 17:41:43', '2024-10-28 18:07:57', NULL),
(11, 2, 'try 2 #napakaangas ', '2024-10-28 18:06:24', '2024-10-28 18:06:24', 3),
(12, 1, 'post to repost', '2024-10-28 18:08:16', '2024-10-28 18:08:16', NULL),
(13, 2, 'post to repost', '2024-10-28 18:08:33', '2024-10-28 18:08:33', 12),
(14, 3, 'post to repost', '2024-10-28 18:09:53', '2024-10-28 18:09:53', 13),
(15, 3, 'post to repost', '2024-10-28 18:13:28', '2024-10-28 18:13:28', 12),
(16, 2, 'post to repost', '2024-10-28 18:14:49', '2024-10-28 18:14:49', 12),
(17, 1, 'post to repost #new #yeye', '2024-10-28 18:17:58', '2024-10-28 18:17:58', NULL),
(18, 2, 'post to repost', '2024-10-28 18:20:50', '2024-10-28 18:20:50', 12),
(19, 2, 'post to repost', '2024-10-28 18:24:36', '2024-10-28 18:24:36', 12),
(20, 2, 'post to repost', '2024-10-28 18:26:15', '2024-10-28 18:26:15', 12),
(21, 2, 'post to repost', '2024-10-28 18:28:17', '2024-10-28 18:28:17', 12),
(22, 2, 'post to repost', '2024-10-28 18:33:14', '2024-10-28 18:33:14', 12),
(23, 2, 'post to repost', '2024-10-28 18:33:19', '2024-10-28 18:33:19', 12),
(25, 2, 'try 2 #napakaangas ', '2024-10-28 18:46:40', '2024-10-28 18:46:40', 5),
(26, 4, 'this is user 4', '2024-10-29 13:25:17', '2024-10-29 13:25:17', NULL),
(27, 1, 'post test #testing ', '2024-11-01 03:03:36', '2024-11-01 03:03:36', NULL),
(28, 1, 'post test 1 #testing ', '2024-11-01 03:03:50', '2024-11-01 03:03:50', NULL),
(29, 1, 'post test 2 #testing ', '2024-11-01 03:03:55', '2024-11-01 03:03:55', NULL),
(30, 1, 'post test 3 #testing ', '2024-11-01 03:04:00', '2024-11-01 03:04:00', NULL),
(31, 1, 'for comment test  #testing ', '2024-11-01 03:04:22', '2024-11-01 03:04:22', NULL),
(32, 1, 'for comment test1  #testing ', '2024-11-01 03:04:29', '2024-11-01 03:04:29', NULL),
(33, 1, 'for comment test2 #testing ', '2024-11-01 03:04:35', '2024-11-01 03:04:35', NULL),
(34, 1, 'for comment test2 #testing #testing2 ', '2024-11-01 03:04:44', '2024-11-01 03:04:44', NULL),
(35, 1, 'for comment ', '2024-11-01 03:05:12', '2024-11-01 03:05:12', NULL),
(36, 1, 'for comment ', '2024-11-01 03:05:13', '2024-11-01 03:05:13', NULL),
(37, 1, 'for comment ', '2024-11-01 03:05:15', '2024-11-01 03:05:15', NULL),
(38, 1, 'for comment ', '2024-11-01 03:05:17', '2024-11-01 03:05:17', NULL),
(39, 1, 'for comment ', '2024-11-01 03:34:48', '2024-11-01 03:34:48', NULL),
(40, 3, ' Hi guys! ', '2024-11-03 12:52:57', '2024-11-03 12:52:57', NULL),
(41, 1, 'for comment ', '2024-11-03 14:46:55', '2024-11-03 14:46:55', 39),
(42, 1, 'for comment ', '2024-11-03 15:12:19', '2024-11-03 15:12:19', 38),
(43, 1, 'for comment test2 #testing ', '2024-11-03 15:21:03', '2024-11-03 15:21:03', 33),
(44, 1, 'for comment reply ', '2024-11-04 13:49:00', '2024-11-04 13:49:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mood_hashtags`
--

CREATE TABLE `mood_hashtags` (
  `id` int(11) NOT NULL,
  `mood_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mood_hashtags`
--

INSERT INTO `mood_hashtags` (`id`, `mood_id`, `hashtag_id`) VALUES
(1, 1, 1),
(6, 6, 1),
(7, 7, 1),
(8, 4, 1),
(9, 8, 1),
(10, 9, 1),
(11, 10, 1),
(12, 10, 1),
(13, 10, 1),
(14, 10, 1),
(15, 10, 15),
(16, 10, 15),
(17, 11, 1),
(18, 17, 23),
(19, 17, 24),
(21, 25, 1),
(22, 27, 27),
(23, 28, 27),
(24, 29, 27),
(25, 30, 27),
(26, 31, 27),
(27, 32, 27),
(28, 33, 27),
(29, 34, 27),
(30, 34, 35),
(31, 43, 27);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL,
  `header_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `fullname`, `email`, `reset_password_token`, `reset_password_expires`, `created_at`, `updated_at`, `profile_image`, `header_image`) VALUES
(1, 'user1', '99727ce56565903180aaaf011d84826f9142fe315be2f5e72fde3ad75d77bf22', 'user1', NULL, NULL, NULL, '2024-10-28 17:10:45', '2024-10-28 17:10:45', NULL, NULL),
(2, 'user2', 'b061523c840b9b7970ad3bf97d06ad274735595f2a50de07975d0c876fdd28b6', 'user2', NULL, NULL, NULL, '2024-10-28 17:10:56', '2024-11-05 12:01:57', 'uploads\\2-13234c470b5fa9e5.png', 'uploads\\2-4ad7ab2af9969eaf.png'),
(3, 'user3', 'c210af7b83f0dc85b55fd6af2e5dcd2bf6c7e99deff418e3919d1c77a03d2377', 'user3', NULL, NULL, NULL, '2024-10-28 18:09:17', '2024-10-28 18:09:17', NULL, NULL),
(4, 'user4x', '0f2c3dfe2b609cc422ed35a0f5ef8469cbc02085b2f13b790128c570271cc375', 'user 4', 'user4@gmail.com', NULL, NULL, '2024-10-29 13:07:15', '2024-11-05 13:33:51', NULL, NULL),
(5, 'user6', '1512ff3f8ae37c233d17d11fca7339b682fb4a3b57510784b1ec2f997f9a209b', 'user6 user6', 'user6@gmail.com', NULL, NULL, '2024-11-05 12:19:14', '2024-11-05 12:19:14', NULL, NULL),
(6, 'user7', '12f5d18131fb2a98cb9453e9a307eea070a7c495222302e5bbb30da3c715523a', 'user7 user7', 'user7@gmail.com', NULL, NULL, '2024-11-05 12:20:34', '2024-11-05 12:20:34', NULL, NULL),
(7, 'user8', '67e2e0c79fd9614aa0b9f8e8c7c53acdbb07ed5e279f30327ed9d544150014f3', 'user8 user8', 'user8@gmail.com', NULL, NULL, '2024-11-05 12:22:26', '2024-11-05 12:22:26', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `mood_id` (`mood_id`);

--
-- Indexes for table `comment_hashtags`
--
ALTER TABLE `comment_hashtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `comment_id` (`comment_id`,`hashtag_id`),
  ADD KEY `hashtag_id` (`hashtag_id`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follower_followee` (`follower_id`,`followee_id`),
  ADD KEY `followee_id` (`followee_id`);

--
-- Indexes for table `hashtags`
--
ALTER TABLE `hashtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag` (`tag`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`mood_id`),
  ADD KEY `mood_id` (`mood_id`);

--
-- Indexes for table `moods`
--
ALTER TABLE `moods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `original_mood_id` (`original_mood_id`);

--
-- Indexes for table `mood_hashtags`
--
ALTER TABLE `mood_hashtags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mood_id` (`mood_id`),
  ADD KEY `hashtag_id` (`hashtag_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `comment_hashtags`
--
ALTER TABLE `comment_hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `hashtags`
--
ALTER TABLE `hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `moods`
--
ALTER TABLE `moods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `mood_hashtags`
--
ALTER TABLE `mood_hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`mood_id`) REFERENCES `moods` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comment_hashtags`
--
ALTER TABLE `comment_hashtags`
  ADD CONSTRAINT `comment_hashtags_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_hashtags_ibfk_2` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`);

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`followee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`mood_id`) REFERENCES `moods` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `moods`
--
ALTER TABLE `moods`
  ADD CONSTRAINT `moods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `moods_ibfk_2` FOREIGN KEY (`original_mood_id`) REFERENCES `moods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `mood_hashtags`
--
ALTER TABLE `mood_hashtags`
  ADD CONSTRAINT `mood_hashtags_ibfk_1` FOREIGN KEY (`mood_id`) REFERENCES `moods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mood_hashtags_ibfk_2` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
