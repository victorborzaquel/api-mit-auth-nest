import { Action } from 'src/enums/action.enum';
import { IPolicyHandler } from 'src/interfaces/policy-handler';
import { Article } from 'src/modules/articles/entities/article.entity';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';

export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Article);
  }
}
