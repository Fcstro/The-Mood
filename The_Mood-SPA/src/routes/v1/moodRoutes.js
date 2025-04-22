import { Router } from 'express';
import MoodController from '../../controllers/v1/moodController.js';
import authentication from '../../middlewares/authentication.js';

const moodRouter = new Router();
const mood = new MoodController();

moodRouter.use(authentication);

moodRouter.post('/', mood.create.bind(mood));
moodRouter.get('/', mood.getAll.bind(mood));
moodRouter.put('/:moodId', mood.update.bind(mood));
moodRouter.delete('/:moodId', mood.delete.bind(mood));


moodRouter.get('/search', mood.searchMoodsAndUsers.bind(mood));


moodRouter.get('/liked/:userId', mood.getLikedMoodsByUser .bind(mood));
moodRouter.post('/:moodId/like', mood.likeMood.bind(mood));
moodRouter.post('/:moodId/unlike', mood.unlikeMood.bind(mood));
moodRouter.get('/:moodId/likes', mood.getLikes.bind(mood));

moodRouter.post('/:moodId/remood', mood.repost.bind(mood));

moodRouter.post('/:moodId/comments', mood.createComment.bind(mood));
moodRouter.get('/:moodId/comments', mood.getComments.bind(mood));
moodRouter.delete('/:moodId/comments/:commentId', mood.deleteComment.bind(mood));
moodRouter.post('/:moodId/comments/:commentId', mood.updateComments.bind(mood));


moodRouter.post('/:moodId/comments/:commentId/like', mood.likeComment.bind(mood));
moodRouter.post('/:moodId/comments/:commentId/unlike', mood.unlikeComment.bind(mood));
moodRouter.get('/:moodId/comments/:commentId/likes', mood.getCommentLikes.bind(mood));

moodRouter.get('/hashtag/:hashtag', mood.hashtagSearch.bind(mood));

moodRouter.get('/for-you', mood.getForYou.bind(mood));
moodRouter.get('/following-feed', mood.getFollowingFeed.bind(mood));


export default moodRouter;
