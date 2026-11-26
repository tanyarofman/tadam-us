/** The visible testimonial summary and JSON-LD use the same submitted ratings. */
export const REVIEW_SCALE = { worstRating: 1, bestRating: 5 } as const;

export function summarizeReviews(reviews: readonly { rating: number }[]) {
  return {
    ...REVIEW_SCALE,
    ratingValue: Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2)),
    reviewCount: reviews.length,
  };
}
