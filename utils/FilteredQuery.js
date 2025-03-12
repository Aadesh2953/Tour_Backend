export default class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let query = { ...this.queryString };
    const excludeFeilds = ["page", "limit", "sort", "fields"];
    excludeFeilds.forEach((field) => delete query[field]);
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    // else{
    //   if()
    //   this.query = this.query.sort("-ratingAverage");
    // }
    return this;
  }
  limitFeilds() {
    if (this.queryString.fields) {
      const selectedFeilds = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectedFeilds);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    let page = parseInt(this.queryString.page) || 1;
    let limit = parseInt(this.queryString.limit) || 100;
    let skip=(page-1)*limit
    this.query = this.query.clone().skip(skip).limit(limit);
    // console.log('query',this.query);
    // console.log('query',this.query);
    // console.log(req);
    return this;
  }
}